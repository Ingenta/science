var getArticleDoiFromFullDOI = function (fullDOI) {
    if (!fullDOI) return "";
    if (fullDOI.indexOf("/") === -1) return fullDOI;
    var articleDOI = fullDOI.split("/")[1];
    if (!articleDOI) return fullDOI;
    return articleDOI;
}

ScienceXML.parseXml = function (path) {
    var results = {};
    //Step 1: get the file
    var xml = ScienceXML.getFileContentsFromLocalPath(path);

    //Step 2: Validate and parse the file
    results.errors = ScienceXML.validateXml(xml);
    if (results.errors.length) {
        return results;
    }

    var doc = new dom().parseFromString(xml);

    // GET DOI, TITLE, VOLUME, ISSUE, MONTH, YEAR, ISSN, ESSN, TOPIC

    var doi = ScienceXML.getSimpleValueByXPath("//article-id[@pub-id-type='doi']", doc);
    if (doi === undefined) results.errors.push("No doi found");
    else {
        doi = doi.trim();
        results.doi = doi;
        results.articledoi = getArticleDoiFromFullDOI(doi);
    }
    console.log('doi:' + results.doi)
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
    console.log('parsed title');

    ScienceXML.getContentType(results, doc);
    console.log('parsed content type');

    var ack = ScienceXML.getValueByXPathIncludingXml("//back/ack", doc);
    if (ack !== undefined) results.acknowledgements = ack;
    console.log('parsed acknowledgements');

    var volume = ScienceXML.getSimpleValueByXPath("//volume", doc);
    if (volume === undefined) results.errors.push("No volume found");
    else results.volume = volume;
    console.log('parsed volume');

    var issue = ScienceXML.getSimpleValueByXPath("//issue", doc);
    if (issue === undefined) results.errors.push("No issue found");
    else results.issue = issue;
    console.log('parsed issue');

    var month = ScienceXML.getSimpleValueByXPath("//pub-date/month", doc);
    if (month === undefined) results.errors.push("No month found");
    else results.month = month;
    console.log('parsed month');

    var year = ScienceXML.getSimpleValueByXPath("//pub-date/year", doc);
    if (year === undefined) results.errors.push("No year found");
    else results.year = year;
    console.log('parsed year');

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
    console.log(topic);
    if (topic) {
        var topicEneity = Topics.findOne({"englishName": topic});
        if (topicEneity) results.topic = topicEneity._id;
    }
    console.log('parsed topic');

    //var keywords = xpath.select("//kwd-group[@kwd-group-type='inspec']/kwd/text()", doc).toString();
    //keywords = keywords.split(',');
    //if (keywords === undefined) results.errors.push("No keywords found");
    //else results.keywords = keywords;

    var keywordsCn=ScienceXML.getKeywords("//kwd-group[@kwd-group-type='inspec'][@lang='zh-Hans']/kwd/text()",doc);
    var keywordsEn=ScienceXML.getKeywords("//kwd-group[@kwd-group-type='inspec'][@lang='en']/kwd/text()",doc);
    if(_.isEmpty(keywordsCn) && _.isEmpty(keywordsEn)){
        keywordsEn=ScienceXML.getKeywords("//kwd-group[@kwd-group-type='inspec']/kwd/text()",doc);
        if(_.isEmpty(keywordsEn)){
            results.errors.push("No keywords found");
        }else{
            results.keywords= {en:keywordsEn};
        }
    }else{
        results.keywords = {
            cn:keywordsCn,
            en:keywordsEn
        }
    }
    console.log('parsed keyword');

    var elocationId = ScienceXML.getSimpleValueByXPath("//article-meta/elocation-id", doc);
    if (elocationId !== undefined) results.elocationId = elocationId;
    console.log('parsed elocationId');

    var essn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='epub']", doc);
    if (essn !== undefined) results.essn = essn;
    console.log('parsed eissn');

    //    GET JOURNAL AND PUBLISHER BY NAME (consider changing journal to find my doi)
    var journalTitle = ScienceXML.getSimpleValueByXPath("//journal-title", doc);
    if (journalTitle === undefined) results.errors.push("No journal title found");
    else results.journalTitle = journalTitle;
    console.log('parsed journal\'s title');

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
    console.log('parsed issn');


    var publisherName = ScienceXML.getSimpleValueByXPath("//publisher-name", doc);
    if (publisherName === undefined) results.errors.push("No publisher name found");
    else {
        results.publisherName = publisherName;
    }
    console.log('parsed publisher');

    //      GET REFERENCES
    results.references = ScienceXML.getReferences(doc);
    console.log('parsed references');

    //      GET ABSTRACT AND FULL TEXT
    results.sections = [];
    results = ScienceXML.getAbstract(results, doc);
    console.log('parsed abstract');


    results = ScienceXML.getFullText(results, doc);
    console.log('parsed fulltext');

    //          GET AUTHORS, NOTES AND AFFILIATIONS
    ScienceXML.getAuthorInfo(results, doc);

    var received = ScienceXML.getDateFromHistory(["Received","received"], doc);
    if (received) results.received = received
    var accepted = ScienceXML.getDateFromHistory(["accepted"], doc);
    if (accepted) results.accepted = accepted
    var published = ScienceXML.getDateFromHistory(["published online","published"], doc);
    if (published) results.published = published

    console.log('parsed date');


    var figuresInFloatGroup=ScienceXML.getFigures(doc);
    if(!_.isEmpty(figuresInFloatGroup)){
        results.figures = results.figures || [];
        results.figures = _.union(results.figures,figuresInFloatGroup);
    }
    console.log('parsed figures');

    results.tables = ScienceXML.getTables(doc);
    console.log('parsed tables');

    var pacsArr = ScienceXML.getPACS(doc);
    console.log('parsed PACS');

    if(!_.isEmpty(pacsArr)){
        results.pacs=pacsArr;
    }

    var fundings= ScienceXML.getFunding(doc);
    if(!_.isEmpty(fundings)){
        results.fundings = fundings;
    }
    console.log("parsed fundings");
    return results;
}

