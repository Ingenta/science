Science.parserAccepted = function(filepath){
    var parserHelper = Science.XPath.ParseHelper;
    var fs = Science.FSE;
    var dom;
    var parse = function (data) {
        var article = {};
        dom = new Science.Dom().parseFromString(data);
        article.issn = parserHelper.getSimpleVal("//journal/issn[@issn_type='print']", dom);
        article.doi = parserHelper.getSimpleVal("//journal/doi", dom);
        if(article.doi)
            article.articledoi = article.doi.split("/")[1];
        article.title = parserHelper.getMultiVal("//article/article_title", dom);
        var authorNodes = parserHelper.getNodes("//author_list", dom);
        article.authors = [];
        //_.each(authorNodes , function(authorNode){
        //    var author = {};
        //    var fullName = {};
        //    author.surname = parserHelper.getMultiVal("//author/child::first_name", authorNode);
        //    author.given = parserHelper.getMultiVal("//author/child::last_name", authorNode);
        //    fullName.en = author.surname.en + " " + author.given.en;
        //    fullName.cn = author.surname.cn + " " + author.given.cn;
        //    author.isPrimary = parserHelper.getFirstAttribute("//author/attribute::corr", authorNode);
        //    author.address = parserHelper.getSimpleVal("//affiliation/child::addr1", authorNode);
        //    author.city = parserHelper.getSimpleVal("//affiliation/child::city", authorNode);
        //    author.state = parserHelper.getSimpleVal("//affiliation/child::state", authorNode);
        //    author.country = parserHelper.getSimpleVal("//affiliation/child::country", authorNode);
        //    if(author.address||author.city||author.state||author.country){
        //        author.affiliation = author.address+" "+author.city+" "+author.state+" "+author.country;
        //    }
        //    author.postCode = parserHelper.getSimpleVal("//affiliation/child::post_code", authorNode);
        //    article.authors.push(author);
        //});
        var isSameAffiliation = function (a, b) {
            return a.affText.cn === b.affText.cn;
        };
        var affiliations = new Science.JSON.UniqueArray("id", isSameAffiliation, 1);
        //var authorNotes = new Science.JSON.UniqueArray("id", undefined, 1);
        var authors = [];
        _.each(authorNodes, function (authorNode) {
            var author = {affs: []};
            var fullName = {};
            var affiliation = {};
            author.surname = parserHelper.getMultiVal("//author/child::first_name", authorNode);
            author.given = parserHelper.getMultiVal("//author/child::last_name", authorNode);
            author.email = parserHelper.getMultiVal("//author/child::email", authorNode);
            fullName.en = author.surname.en + " " + author.given.en;
            fullName.cn = author.surname.cn + " " + author.given.cn;
            author.isPrimary = parserHelper.getFirstAttribute("//author/attribute::corr", authorNode);
            author.address = parserHelper.getSimpleVal("//affiliation/child::addr1", authorNode);
            author.city = parserHelper.getSimpleVal("//affiliation/child::city", authorNode);
            author.state = parserHelper.getSimpleVal("//affiliation/child::state", authorNode);
            author.country = parserHelper.getSimpleVal("//affiliation/child::country", authorNode);
            if(author.address||author.city||author.state||author.country){
                author.affiliation = author.address+" "+author.city+" "+author.state+" "+author.country;
            }
            author.postCode = parserHelper.getSimpleVal("//affiliation/child::post_code", authorNode);
            if (author.affiliation) {
                var affCnArr = author.affiliation;
                var affEnArr = author.affiliation;
                if (_.isEmpty(affCnArr))
                    affCnArr = affEnArr;
                 for (var i = 0; i < affCnArr.length; i++) {
                    var index = affiliations.push({affText: {cn: affCnArr[i], en: affEnArr[i]}});
                    author.affs.push(index);
                };
                author.affs = _.uniq(author.affs);
            }

            if (authorNode.isPrimary === 'true' && authorNode.email) {
                var index = authorNotes.push({email: authorNode.email});
                author.email = index;
            }
            article.authors.push(author);
        });
        //为了与新数据格式保持一致,当只有一个地址(工作单位?)时,不显示地址上标
        //以下内容为此功能的实现.
        if (affiliations.count() <= 1) {
            authors = _.map(authors, function (author) {
                delete author.affs;
                return author;
            })
        }
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
        article.keywords = {en: keywords,cn: keywords};
        if(article.issn){
            article.issn = article.issn.replace("-","");
            var publication = Publications.findOne({issn:article.issn});
            if(publication){
                article.publisher= publication.publisher;
                article.journalId =publication._id;
            }
        }
        return article;
    }
    if(Science.FSE.existsSync(filepath))
        return parse(Science.FSE.readFileSync(filepath, 'utf-8'));
}