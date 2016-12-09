Parser = function (filepath, options, callback) {
    var parseHelper = _.clone(Science.XPath.ParseHelper);
    parseHelper.setLangArr({cn: 'zh_CN', en: 'en_US'});
    var fs = Science.FSE;
    var dom;

    var convertlt = function(obj){
        if(_.isString(obj)){
            obj= obj && obj.replace('&lt;','<') || obj;
        }
        if(_.isObject(obj)){
            obj.cn=obj.cn && obj.cn.replace('&lt;','<') || obj.cn;
            obj.en=obj.en && obj.en.replace('&lt;','<') || obj.en;
        }
        return obj;
    }

    var splitStr = function(obj){
        if(_.isString(obj)){
            obj= obj && obj.split(';') || obj;
        }
        if(_.isObject(obj)){
            obj.cn=obj.cn && obj.cn.split(';') || obj.cn;
            obj.en=obj.cn && obj.en.split(';') || obj.en;
        }
        return obj;
    }

    var insertKeywords = function (a) {
        if (!a)return;
        if (a.cn) {
            a.cn.forEach(function (name) {
                if (!Keywords.findOne({name: name})) {
                    Keywords.insert({
                        lang: "cn",
                        name: name,
                        score: 0
                    });
                }
            })
        }
        if (a.en) {
            a.en.forEach(function (name) {
                if (!Keywords.findOne({name: name})) {
                    Keywords.insert({
                        lang: "en",
                        name: name,
                        score: 0
                    });
                }
            })
        }
    }
    /**
     * 异步方法
     * 解析DOM
     * @param data
     */
    var parse = function (data) {
        dom = new Science.Dom().parseFromString(data);
        var issue = {};
        issue.issn = parseHelper.getSimpleVal("//issue/issn", dom);
        issue.journalName = parseHelper.getSimpleVal("//issue/journalname", dom);
        issue.title = parseHelper.getSimpleVal("//issue/title", dom);
        issue.year = parseHelper.getSimpleVal("//issue/year", dom);
        issue.volume = parseHelper.getSimpleVal("//issue/volume", dom);
        issue.issue = parseHelper.getSimpleVal("//issue/number", dom);
        if(!options.importArticle && !options.importPdf){
            callback(undefined,issue);
            return;
        }

        issue.articles = [];
        var sections = parseHelper.getNodes("//issue/section", dom);
        _.each(sections, function (sec) {
            var articleNodes = parseHelper.getNodes("child::article", sec);
            var property = parseHelper.getSimpleVal("child::title", sec);
            _.each(articleNodes, function (articleNode) {
                var article = {};
                article.contentType = Science.data.tranOldJournalContentType(property);
                article.language = parseHelper.getSimpleVal("child::language", articleNode);
                article.doi = parseHelper.getSimpleVal("child::id[@type=\"doi\"]", articleNode);
                article.title = convertlt(parseHelper.getMultiVal("child::title[@locale='{lang}']", articleNode));
                article.subject = splitStr(parseHelper.getMultiVal("child::subject[@locale='{lang}']", articleNode));
                article.subspecialty = splitStr(parseHelper.getMultiVal("child::subspecialty[@locale='{lang}']", articleNode));
                article.abstract = convertlt(parseHelper.getMultiVal("child::abstract[@locale='{lang}']", articleNode));
                article.indexing = splitStr(convertlt(parseHelper.getMultiVal("child::indexing/subject[@locale='{lang}']", articleNode)));
                article.pages = parseHelper.getSimpleVal("child::pages", articleNode);
                article.startPage = parseHelper.getSimpleVal("child::start_page", articleNode);
                article.endPage = parseHelper.getSimpleVal("child::endPage | child::end_page", articleNode);
                article.pdf = parseHelper.getFirstAttribute("child::galley/file/href[@mime_type='application/pdf']/attribute::src", articleNode);
                article.publishDate = parseHelper.getSimpleVal("child::publish_date", articleNode);
                article.acceptDate = parseHelper.getSimpleVal("child::accept_date", articleNode);
                article.authors = [];
                var authorNodes = parseHelper.getNodes("child::author", articleNode);
                _.each(authorNodes, function (authorNode) {
                    var author = {};
                    author.isPrimary = parseHelper.getFirstAttribute("attribute::primary_contact", authorNode);
                    author.firstname = parseHelper.getSimpleVal("child::firstname", authorNode);
                    author.middlename = parseHelper.getSimpleVal("child::middlename", authorNode);
                    author.lastname = parseHelper.getSimpleVal("child::lastname", authorNode);
                    author.authorname = parseHelper.getMultiVal("child::authorname[@locale='{lang}']", authorNode);
                    author.affiliation = parseHelper.getMultiVal("child::affiliation[@locale='{lang}']", authorNode);
                    author.email = parseHelper.getSimpleVal("child::email", authorNode);
                    article.authors.push(author);
                });
                article.citations = [];
                var citationNodes = parseHelper.getNodes("child::citation", articleNode);
                _.each(citationNodes, function (citationNode) {
                    var citation = {};
                    citation.no = parseHelper.getFirstAttribute("attribute::no", citationNode);
                    citation.fullContent = parseHelper.getSimpleVal("child::citation_full", citationNode);
                    if (citation.fullContent)
                        citation.fullContent = citation.fullContent.trim().replace('&lt;', '<');
                    citation.title = parseHelper.getSimpleVal("child::citation_title", citationNode);
                    citation.journal = parseHelper.getSimpleVal("child::citation_journal", citationNode);
                    citation.year = parseHelper.getSimpleVal("child::citation_year", citationNode);
                    citation.volume = parseHelper.getSimpleVal("child::citation_volume", citationNode);
                    citation.startPage = parseHelper.getSimpleVal("child::citation_startpage", citationNode);
                    citation.endPage = parseHelper.getSimpleVal("child::citation_endpage", citationNode);
                    article.citations.push(citation);
                })
                issue.articles.push(article);
            })
        });
        callback(undefined, issue);
    };
    /**
     * 异步方法
     * 读取xml文件
     */
    var readXml = function () {
        fs.readFile(filepath, 'utf-8', function (err, data) {
            if (err) {
                callback(err);
                return;
            }
            parse(data);
        })
    };
    /**
     * 异步方法
     * 判断文件是否存在
     */
    var start = function () {
        fs.exists(filepath, function (info) {
            if (info !== true) {
                callback(info);
                return;
            }
            readXml();
        });
    };
    //开始
    start();
};