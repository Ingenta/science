Science.parserAcceped = function(filepath){
    var parseHelper = Science.XPath.ParseHelper;
    var fs = Science.FSE;
    var dom;
    var parse = function (data) {
        var article = {};
        dom = new Science.Dom().parseFromString(data);
        article.issn = parserHelper.getSimpleVal("//journal/issn", dom);
        article.doi = parserHelper.getSimpleVal("//journal/doi", dom);
        article.title = parseHelper.getMultiVal("//article/article_title", dom);
        var authorNodes = parseHelper.getNodes("//author_list/author", dom);
        article.authors = [];
        _.each(authorNodes , function(authorNode){
            var author = {};
            var fullName = {};
            author.surname = parseHelper.getMultiVal("child::first_name", authorNode);
            author.given = parseHelper.getMultiVal("child::last_name", authorNode);
            fullName.en = author.surname.en + " " + author.given.en;
            fullName.cn = author.surname.cn + " " + author.given.cn;
            author.isPrimary = parseHelper.getFirstAttribute("attribute::corr", authorNode);
            author.address = parseHelper.getSimpleVal("child::addr1", authorNode);
            article.authors.push(author);
        });
        article.abstract = parseHelper.getMultiVal("//article/abstract", dom);
        article.fundings = parseHelper.getSimpleVal("//configurable_data_fields/custom_fields[@cd_code='Funding source']", dom);
        article.contentType = parseHelper.getSimpleVal("//article/publication_type", dom);
        var year = parseHelper.getSimpleVal("//ms_id/rev_id[text()=0]/following::submitted_date/year", dom);
        var month = parseHelper.getSimpleVal("//ms_id/rev_id[text()=0]/following::submitted_date/month", dom);
        var day = parseHelper.getSimpleVal("//ms_id/rev_id[text()=0]/following::submitted_date/day", dom);
        if(year && month && day){
            article.received = new Date(Date.parse(year + '/ ' + month + '/' + day));
        }
        article.accepted = parseHelper.getFirstAttribute("//history/task[@name='EM Final Decision']/status/attribute::event_date", dom);
        article.topic = parseHelper.getFirstAttribute("//content/attr_type[@name='Speciality']/attribute/attribute::name", dom);
        article.keywords = parseHelper.getSimpleVal("//content/attr_type[@name='Keywords']/attribute/attribute::name", dom);
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