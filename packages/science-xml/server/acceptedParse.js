Science.parserAcceped = function(filepath){
    var parserHelper = Science.XPath.ParseHelper;
    var fs = Science.FSE;
    var dom;
    var parse = function (data) {
        var article = {};
        dom = new Science.Dom().parseFromString(data);
        article.issn = parserHelper.getSimpleVal("//journal/issn[@issn_type='print']", dom);
        article.doi = parserHelper.getSimpleVal("//journal/doi", dom);
        article.title = parserHelper.getMultiVal("//article/article_title", dom);
        var authorNodes = parserHelper.getNodes("//author_list/author", dom);
        article.authors = [];
        _.each(authorNodes , function(authorNode){
            var author = {};
            var fullName = {};
            author.surname = parserHelper.getMultiVal("child::first_name", authorNode);
            author.given = parserHelper.getMultiVal("child::last_name", authorNode);
            fullName.en = author.surname.en + " " + author.given.en;
            fullName.cn = author.surname.cn + " " + author.given.cn;
            author.isPrimary = parserHelper.getFirstAttribute("attribute::corr", authorNode);
            author.address = parserHelper.getSimpleVal("child::addr1", authorNode);
            article.authors.push(author);
        });
        article.abstract = parserHelper.getMultiVal("//article/abstract", dom);
        article.fundings = parserHelper.getFirstAttribute("//configurable_data_fields/custom_fields[@cd_code='Funding source']/attribute::cd_value", dom);
        article.contentType = parserHelper.getSimpleVal("//article/publication_type", dom);
        var year = parserHelper.getSimpleVal("//ms_id/rev_id[text()=0]/parent::ms_id/submitted_date/year", dom);
        var month = parserHelper.getSimpleVal("//ms_id/rev_id[text()=0]/parent::ms_id/submitted_date/month", dom);
        var day = parserHelper.getSimpleVal("//ms_id/rev_id[text()=0]/parent::ms_id/submitted_date/day", dom);
        if(year && month && day){
            article.received = new Date(Date.parse(year + '/ ' + month + '/' + day));
        }
        article.accepted = parserHelper.getFirstAttribute("//task[@name='EM Final Decision']/status/attribute::event_date", dom);
        if(article.accepted)
            article.accepted = article.accepted.split("T")[0];
        article.topic = parserHelper.getFirstAttribute("//content/attr_type[@name='Speciality']/attribute/attribute::name", dom);
        var keywords = parserHelper.getAttributes("//content/attr_type[@name='Keywords']/attribute/attribute::name", dom);
        article.keywords = {en: keywords,cn: keywords}
        return article;
    }
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
}