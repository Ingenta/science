Science.parserAcceped = function(filepath){
    var parseHelper = Science.XPath.ParseHelper;
    var fs = Science.FSE;
    var dom;
    var parse = function (data) {
        var article = {};
        dom = new Science.Dom().parseFromString(data);
        article.issn = parserHelper.getSimpleVal("//journal/issn", dom);
        article.doi = parserHelper.getSimpleVal("//journal/doi", dom);
        article.title = parseHelper.getSimpleVal("//article/article_title", dom);
        var authorNodes = parseHelper.getNodes("//author_list/author", dom);
        article.authors = [];
        _.each(authorNodes , function(authorNode){
            var author = {};
            author.firstName = parseHelper.getSimpleVal("child::first_name", authorNode);
            author.lastName = parseHelper.getSimpleVal("child::last_name", authorNode);
            author.isPrimary = parseHelper.getFirstAttribute("attribute::corr", authorNode);
            author.address = parseHelper.getSimpleVal("child::addr1", authorNode);
            article.authors.push(author);
        })
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