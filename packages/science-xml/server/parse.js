var getArticleDoiFromFullDOI = function (fullDOI) {
    if (!fullDOI) return "";
    if (fullDOI.indexOf("/") === -1) return fullDOI;
    var articleDOI = fullDOI.split("/")[1];
    if (!articleDOI) return fullDOI;
    return articleDOI;
}
var isValidDoi = function (doi) {
    if (!doi) return false;
    if (doi.split('/').length !== 2) return false;
    if (_.isEmpty(doi.split('/')[0].trim())) return false;
    if (_.isEmpty(doi.split('/')[1].trim())) return false;
    return true;
}

ScienceXML.parseXml = function (path, pubStatus) {
    var results = {};
    //Step 1: get the file
    var xml = ScienceXML.getFileContentsFromLocalPath(path);

    //Step 2: Validate and parse the file
    results.errors = ScienceXML.validateXml(xml);
    if (!_.isEmpty(results.errors)) {
        return results;
    }

    var doc = new dom().parseFromString(xml);

    // GET DOI, TITLE, VOLUME, ISSUE, MONTH, YEAR, ISSN, ESSN, TOPIC

    var doi = ScienceXML.getSimpleValueByXPath("//article-id[@pub-id-type='doi']", doc);
    if (doi === undefined) results.errors.push("No doi found");
    else {
        doi = doi.trim();
        if (!isValidDoi(doi)) results.errors.push("doi: bad format should be in the form 11.1111/111");
        else {
            results.doi = doi;
            results.articledoi = getArticleDoiFromFullDOI(doi);
        }
    }
    logger.info('doi: ' + results.doi)
    //    解析完xml再做重复DOI检查，蒋凯2015-9-30
    //    CHECK IF EXISTING ARTICLE
    //var existingArticle = Articles.findOne({doi: results.doi});
    //if (existingArticle !== undefined)results.errors.push("Article found matching this DOI: " + results.doi);

    var primaryTitle = ScienceXML.getSimpleValueByXPath("//article-title", doc);
    if (primaryTitle === undefined) results.errors.push("No title found");
    else {
        results.title = {};
        var primaryLang = xpath.select("//article-title/attribute::lang", doc);
        if (primaryLang[0] === undefined) {
            results.title.en = primaryTitle;
            results.title.cn = primaryTitle;
        }
        else {
            primaryLang = primaryLang[0].value;
            var secondaryTitle = ScienceXML.getSimpleValueByXPath("//trans-title-group/trans-title", doc);
            if (primaryLang === 'en') {
                results.title.en = primaryTitle;
                if (secondaryTitle === undefined) results.title.cn = primaryTitle;
                else results.title.cn = secondaryTitle;
            }
            else if (primaryLang === 'zh-Hans') {
                results.title.cn = primaryTitle;
                if (secondaryTitle === undefined) results.title.en = primaryTitle;
                else results.title.en = secondaryTitle;
            }
        }
    }
    logger.info('parsed title');

    ScienceXML.getContentType(results, doc);
    logger.info('parsed content type');

    var ack = ScienceXML.getValueByXPathIncludingXml("//back/ack", doc);
    if (ack !== undefined) results.acknowledgements = ack;
    logger.info('parsed acknowledgements');

    var volume = ScienceXML.getSimpleValueByXPath("//volume", doc);
    if (volume === undefined && pubStatus==='normal') results.errors.push("No volume found");
    else results.volume = volume;
    logger.info('parsed volume');

    var issue = ScienceXML.getSimpleValueByXPath("//issue", doc);
    if (issue === undefined && pubStatus==='normal') results.errors.push("No issue found");
    else results.issue = issue;
    logger.info('parsed issue');

    var month = ScienceXML.getSimpleValueByXPath("//pub-date/month", doc);
    if (month === undefined && pubStatus==='normal') results.errors.push("No month found");
    else results.month = month;
    logger.info('parsed month');

    var year = ScienceXML.getSimpleValueByXPath("//pub-date/year", doc);
    if (year === undefined && pubStatus==='normal') results.errors.push("No year found");
    else results.year = year;
    logger.info('parsed year');

    //var topic = ScienceXML.getSimpleValueByXPath("//subj-group/subj-group/subject", doc);
    //if (topic === undefined) {
    //    topic = ScienceXML.getSimpleValueByXPath("//subj-group/subject", doc);
    //    if (topic === undefined)results.errors.push("No subject found");
    //}
    //else {
    //    var topicEneity = Topics.findOne({"englishName": topic});
    //    if (topicEneity)
    //        results.topic = topicEneity._id;
    //    else {
    //        results.errors.push("No subject match:" + topic);
    //    }
    //}

    var topic = ScienceXML.getSimpleValueByXPath("//subj-group/subject", doc);
    logger.info(topic);
    if (topic) {
        var topicEneity = Topics.findOne({$or:[{name:topic},{englishName:topic}]});
        if (topicEneity)
            results.topic = [topicEneity._id];
    }
    logger.info('parsed topic');

    //var keywords = xpath.select("//kwd-group[@kwd-group-type='inspec']/kwd/text()", doc).toString();
    //keywords = keywords.split(',');
    //if (keywords === undefined) results.errors.push("No keywords found");
    //else results.keywords = keywords;

    var keywordsCn = ScienceXML.getKeywords("//kwd-group[@kwd-group-type='inspec'][@lang='zh-Hans']/kwd/text()", doc);
    var keywordsEn = ScienceXML.getKeywords("//kwd-group[@kwd-group-type='inspec'][@lang='en']/kwd/text()", doc);
    if (_.isEmpty(keywordsCn) && _.isEmpty(keywordsEn)) {
        keywordsEn = ScienceXML.getKeywords("//kwd-group[@kwd-group-type='inspec']/kwd/text()", doc);
        if (_.isEmpty(keywordsEn)) {
            results.keywords={};
            //results.errors.push("No keywords found");//允许没有关键词信息
        } else {
            results.keywords = {en: keywordsEn,cn:keywordsEn};
        }
    }else {
        if(_.isEmpty(keywordsCn)){
            keywordsCn=keywordsEn;
        }else if(_.isEmpty(keywordsEn)){
            keywordsEn=keywordsCn;
        }
        results.keywords = {
            cn: keywordsCn,
            en: keywordsEn
        }
    }
    logger.info('parsed keyword');

    var elocationId = ScienceXML.getSimpleValueByXPath("//article-meta/elocation-id", doc);
    if (elocationId !== undefined) results.elocationId = elocationId;
    logger.info('parsed elocationId');

    var essn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='epub']", doc);
    if (essn !== undefined) results.essn = essn;
    logger.info('parsed eissn');

    //    GET JOURNAL AND PUBLISHER BY NAME (consider changing journal to find my doi)
    var journalTitle = ScienceXML.getSimpleValueByXPath("//journal-title", doc);
    if (journalTitle === undefined) results.errors.push("No journal title found");
    else results.journalTitle = journalTitle;
    logger.info('parsed journal\'s title');

    var issn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='ppub']", doc);
    if (issn === undefined) {
        results.errors.push("No issn found in xml");
    } else {
        results.issn = issn.replace("-", "");
        var journal = Publications.findOne({issn: results.issn});
        if (journal === undefined) results.errors.push("No such issn found in journal collection: " + issn);
        else {
            results.journalId = journal._id;
            results.publisher = journal.publisher;
        }
    }
    logger.info('parsed issn');


    var publisherName = ScienceXML.getSimpleValueByXPath("//publisher-name", doc);
    if (publisherName === undefined) results.errors.push("No publisher name found");
    else {
        results.publisherName = publisherName;
    }
    logger.info('parsed publisher');

    //      GET REFERENCES
    results.references = ScienceXML.getReferences(results, doc);
    logger.info('parsed references');

    //      GET ABSTRACT AND FULL TEXT
    results.sections = [];
    results = ScienceXML.getAbstract(results, doc);
    logger.info('parsed abstract');


    results = ScienceXML.getFullText(results, doc);
    logger.info('parsed fulltext');

    //          GET AUTHORS, NOTES AND AFFILIATIONS
    ScienceXML.getAuthorInfo(results, doc);

    var received = ScienceXML.getDateFromHistory(["Received", "received"], doc);
    if (received) results.received = received
    var accepted = ScienceXML.getDateFromHistory(["accepted"], doc);
    if (accepted) results.accepted = accepted
    var published = ScienceXML.getDateFromHistory(["published online", "published"], doc);
    if (published) results.published = published

    logger.info('parsed date');


    var figuresInFloatGroup = ScienceXML.getFigures(doc);
    if (!_.isEmpty(figuresInFloatGroup)) {
        results.figures = results.figures || [];
        results.figures = _.union(results.figures, figuresInFloatGroup);
    }
    logger.info('parsed figures');


    var tablesInFloatGroup = ScienceXML.getTables(doc);
    if (!_.isEmpty(tablesInFloatGroup)) {
        results.tables = results.tables || [];
        results.tables = _.union(results.tables, tablesInFloatGroup);
    }
    logger.info('parsed tables');

    var pacsArr = ScienceXML.getPACS(doc);
    logger.info('parsed PACS');

    if (!_.isEmpty(pacsArr)) {
        results.pacs = pacsArr;
    }

    var fundings = ScienceXML.getFunding(doc);
    if (!_.isEmpty(fundings)) {
        results.fundings = fundings;
    }
    logger.info("parsed fundings");
    return results;
}

