Science.DOIValidator = {};

Science.DOIValidator = Npm.require('doi-regex');

ScienceXML.getArticleDoiFromFullDOI = function (fullDOI) {
    //if (!fullDOI) return "";
    //if (fullDOI.indexOf("/") === -1) return fullDOI;
    //var articleDOI = fullDOI.split("/")[1];
    //if (!articleDOI) return fullDOI;
    //return articleDOI;
    return Science.data.getArticleDoiFromFullDOI(fullDOI)
}
ScienceXML.isValidDoi = function (doi) {
    //if (!doi) return false;
    ////NOTE: only has one slash, for now not allowing oxford press data
    //if (doi.split('/').length !== 2) return false;
    //return Science.DOIValidator({exact: true}).test(doi);
    return Science.data.isValidDoi(doi);
}



ScienceXML.parseXml = function (path, log) {
    var pubStatus = log.pubStatus;
    logger.info("parse xml start..");
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

    var doi = ScienceXML.getSimpleValueByXPath("//article-meta/article-id[@pub-id-type='doi']", doc);
    if (doi === undefined) results.errors.push("No doi found");
    else {
        doi = doi.trim();
        if (!ScienceXML.isValidDoi(doi)) results.errors.push("doi: bad format should be in the form 10.1000/xyz000 %#?\" and space must be encoded");
        else {
            results.doi = doi;
            results.articledoi = ScienceXML.getArticleDoiFromFullDOI(doi);
        }
    }
    logger.info('doi: ' + results.doi)
    //    解析完xml再做重复DOI检查，蒋凯2015-9-30
    //    CHECK IF EXISTING ARTICLE
    //var existingArticle = Articles.findOne({doi: results.doi});
    //if (existingArticle !== undefined)results.errors.push("Article found matching this DOI: " + results.doi);

    var title = ScienceXML.getTitle(doc);
    if (title)
        results.title = title;
    else
        results.errors.push("No title found");
    logger.info('parsed title');

    ScienceXML.getContentType(results, doc);
    logger.info('parsed content type');

    var volume = ScienceXML.getSimpleValueByXPath("//article-meta/volume", doc);
    if (volume === undefined && pubStatus === 'normal') results.errors.push("//article-meta/volume not found");
    else results.volume = volume;
    logger.info('parsed volume');

    var issue = ScienceXML.getSimpleValueByXPath("//article-meta/issue", doc);
    if (issue === undefined && pubStatus === 'normal') results.errors.push("//article-meta/issue not found");
    else results.issue = issue;
    logger.info('parsed issue');

    var month = ScienceXML.getSimpleValueByXPath("//article-meta/pub-date/month", doc);
    if (month === undefined && pubStatus === 'normal') results.errors.push("//article-meta/pub-date/month not found");
    else results.month = month;
    logger.info('parsed month');

    var year = ScienceXML.getSimpleValueByXPath("//article-meta/pub-date/year", doc);
    if (year === undefined && pubStatus === 'normal' && !Science.isNumeric(year)) results.errors.push("article-meta/pub-date/year not found, or is not a number");
    else results.year = year;
    logger.info('parsed year');

    var topic = ScienceXML.getSimpleValueByXPath("//subj-group/subject", doc);
    logger.info(topic);
    if (topic) {
        topic = topic.trim();
        var topicEntity = Topics.findOne({$or: [{name: topic}, {englishName: topic}]});
        if (topicEntity)
            results.topic = [topicEntity._id];
    }
    logger.info('parsed topic');


    var keywordsCn = ScienceXML.getKeywords("//article-meta/kwd-group[@kwd-group-type='inspec'][@lang='zh-Hans']/kwd", doc);
    var keywordsEn = ScienceXML.getKeywords("//article-meta/kwd-group[@kwd-group-type='inspec'][@lang='en']/kwd", doc);
    if (_.isEmpty(keywordsCn) && _.isEmpty(keywordsEn)) {
        keywordsEn = ScienceXML.getKeywords("//article-meta/kwd-group[@kwd-group-type='inspec']/kwd", doc);
        if (_.isEmpty(keywordsEn)) {
            results.keywords = {};
        } else {
            results.keywords = {en: keywordsEn, cn: keywordsEn};
        }
    } else {
        if (_.isEmpty(keywordsCn)) {
            keywordsCn = keywordsEn;
        } else if (_.isEmpty(keywordsEn)) {
            keywordsEn = keywordsCn;
        }
        results.keywords = {
            cn: keywordsCn,
            en: keywordsEn
        }
    }
    logger.info('parsed keyword');

    var elocationId = ScienceXML.getSimpleValueByXPath("//article-meta/elocation-id", doc);
    if (elocationId !== undefined) {
        results.elocationId = elocationId;
    } else {
        var startPage = ScienceXML.getSimpleValueByXPath("//article-meta/fpage", doc);
        var endPage = ScienceXML.getSimpleValueByXPath("//article-meta/lpage", doc);
        if (startPage !== undefined) {
            results.startPage = startPage;
        }
        results.elocationId = startPage;
        logger.info('parsed startPage');
        if (endPage !== undefined) results.endPage = endPage;
        logger.info('parsed endPage');
    }
    logger.info('parsed elocationId');

    var essn = ScienceXML.getSimpleValueByXPath("//journal-meta/issn[@pub-type='epub']", doc);
    if (essn !== undefined) results.essn = essn;
    logger.info('parsed eissn');

    //    GET JOURNAL AND PUBLISHER BY NAME (consider changing journal to find my doi)
    var journalTitle = ScienceXML.getSimpleValueByXPath("//journal-meta/journal-title-group/journal-title", doc);
    if (journalTitle === undefined) results.errors.push("No journal title found");
    else results.journalTitle = journalTitle;
    logger.info('parsed journal\'s title');

    var issn = ScienceXML.getSimpleValueByXPath("//journal-meta/issn[@pub-type='ppub']", doc);
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


    var publisherName = ScienceXML.getSimpleValueByXPath("//journal-meta/publisher/publisher-name", doc);
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

    ScienceXML.getOtherFigures(doc,log)

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

    var ack = ScienceXML.getAck(doc);
    if(!_.isEmpty(ack)){
        results.acknowledgements = ack;
    }
    logger.info("parsed ack");

    var openAccess = ScienceXML.getOpenAccess(doc);
    if(!_.isEmpty(openAccess)){
        results.openAccess = openAccess;
    }
    logger.info("parsed open access");

    var interestStatement = ScienceXML.getInterestStatement(doc);
    if(!_.isEmpty(interestStatement)){
        results.interest = interestStatement;
    }
    logger.info("parsed interest statement");

    var contributions = ScienceXML.getContributionsStatement(doc);
    if(!_.isEmpty(contributions)){
        results.contributions = contributions;
    }
    logger.info("parsed contributions statement");

    var sst = ScienceXML.getSpecialTopicTitle(doc);
    if(!_.isEmpty(sst)){
        results.special = sst;
    }
    logger.info("parsed special topic title");

    var appendix = ScienceXML.getAppendix(doc);
    if(!_.isEmpty(appendix)){
        results.appendix = appendix;
    }
    return results;
}

