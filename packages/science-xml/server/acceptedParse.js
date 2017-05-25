Science.parserAccepted = function(filepath){
    var parserHelper = Science.XPath.ParseHelper;
    var fs = Science.FSE;
    var dom;
    var parse = function (data) {
        var article = {errors:[]};
        dom = new Science.Dom().parseFromString(data);
        article.issn = parserHelper.getSimpleVal("//journal/issn[@issn_type='print'] | //article/journal_issn", dom);
        article.doi = parserHelper.getSimpleVal("//journal/doi | //article/doi", dom);
        if(article.doi){
            if (!ScienceXML.isValidDoi(article.doi)) results.errors.push("doi: bad format should be in the form 11.1111/111");
            else {
                article.doi = article.doi.trim();
                article.articledoi = ScienceXML.getArticleDoiFromFullDOI(article.doi);
            }
        }else{
            article.errors.push("No doi found");
        }
        var title = parserHelper.getMultiVal("//article/article_title", dom);
        if(title)
            article.title=title;
        else
            article.errors.push("No title found");

        var authorNodes = parserHelper.getNodes("//author_list/author", dom);
        var isSameAffiliation = function (a, b) {
            return a.affText.cn.replace(/[\.,;，。；\s]/g,'') === b.affText.cn.replace(/[\.,;，。；\s]/g,'');
        };
        var affiliations = new Science.JSON.UniqueArray("id", isSameAffiliation, 1);
        var authorNotes = new Science.JSON.UniqueArray("id", undefined, 1);
        var authors = [];
        _.each(authorNodes, function (authorNode) {
            var author = {affs: []};
            var fullName = {};
            author.surname = parserHelper.getMultiVal("child::last_name", authorNode);
            author.given = parserHelper.getMultiVal("child::first_name", authorNode);
            fullName.en = author.surname.en + " " + author.given.en;
            fullName.cn = author.surname.cn + author.given.cn;
            author.fullname=fullName;

            var address = parserHelper.getSimpleVal("child::affiliation/addr1", authorNode) || "";
            var city = parserHelper.getSimpleVal("child::affiliation/city", authorNode) || "";
            var state = parserHelper.getSimpleVal("child::affiliation/state", authorNode) || "";
            var country = parserHelper.getSimpleVal("child::affiliation/country", authorNode) || "";
            var postCode = parserHelper.getSimpleVal("child::affiliation/post_code", authorNode) || "";
            if(address|| city|| state|| country){
                var affiliation = address +" "+city +" "+state +" "+country + " " + postCode;
                author.affs.push(affiliations.push({affText: {cn: affiliation, en: affiliation}}));
            }

            var isPrimary = parserHelper.getFirstAttribute("attribute::corr", authorNode);
            var email = parserHelper.getSimpleVal("child::email", authorNode);
            if (isPrimary === 'true' && email) {
                var index = authorNotes.push({email: email});
                author.email = index;
            }
            authors.push(author);
        });
        //为了与新数据格式保持一致,当只有一个地址(工作单位?)时,不显示地址上标
        //以下内容为此功能的实现.
        if (affiliations.count() <= 1) {
            authors = _.map(authors, function (author) {
                delete author.affs;
                return author;
            })
        }
        article.authors=authors;
        article.authorNotes=authorNotes.getArray();
        article.affiliations=affiliations.getArray();

        article.abstract = parserHelper.getMultiVal("//article/abstract", dom);
        article.fundings = parserHelper.getFirstAttribute("//configurable_data_fields/custom_fields[@cd_code='Funding source']/attribute::cd_value", dom);
        article.contentType = parserHelper.getSimpleVal("//article/publication_type | //article/manuscript_type", dom);
        article.contentType = Science.data.tranContentType(article.contentType);

        var recDateStr = parserHelper.getSimpleVal("//received_date",dom);
        if(recDateStr){
            article.received = new Date(Date.parse(recDateStr));
        }else{
            var year = parserHelper.getSimpleVal("//ms_id/rev_id[text()=0]/parent::ms_id/submitted_date/year", dom);
            var month = parserHelper.getSimpleVal("//ms_id/rev_id[text()=0]/parent::ms_id/submitted_date/month", dom);
            var day = parserHelper.getSimpleVal("//ms_id/rev_id[text()=0]/parent::ms_id/submitted_date/day", dom);
            if(year && month && day){
                article.received = new Date(Date.parse(year + '/ ' + month + '/' + day));
            }
        }
        var acceptedDateStr = parserHelper.getFirstAttribute("//task[@name='EM Final Decision']/status/attribute::event_date | //task[@name='AE Make Decision']/status/attribute::event_date", dom);
        if(acceptedDateStr){
            article.accepted = new Date(Date.parse(acceptedDateStr.split("T")[0]));
        }else{
            acceptedDateStr = parserHelper.getSimpleVal("//publish_date",dom)
            if(acceptedDateStr){
                article.accepted = new Date(Date.parse(acceptedDateStr));
            }else{
                var yearAc = parserHelper.getSimpleVal("//ms_id/decision_date/year", dom);
                var monthAc = parserHelper.getSimpleVal("//ms_id/decision_date/month", dom);
                var dayAc = parserHelper.getSimpleVal("//ms_id/decision_date/day", dom);
                if(yearAc && monthAc && dayAc){
                    article.accepted = new Date(Date.parse(yearAc + '/ ' + monthAc + '/' + dayAc));
                }
            }
        }

        var topicStr = parserHelper.getFirstAttribute("//content/attr_type[@name='Speciality']/attribute/attribute::name", dom);
        if(!topicStr){
            topicStr = parserHelper.getSimpleVal("//article/manuscript_fieldtwo",dom);
        }
        if(topicStr){
            var t=Topics.findOne({$or:[{name:topicStr},{englishName:topicStr}]});
            if(t)
                article.topic= [t._id];
        }
        var keywords = parserHelper.getAttributes("//content/attr_type[@name='Keywords']/attribute/attribute::name", dom);
        if(!keywords){
            var kwStr = parserHelper.getSimpleVal("//article/key_word", dom);
            if(_.isString(kwStr))
                keywords = kwStr.split(/,\s?/);
        }
        article.keywords = {en: keywords,cn: keywords};
        if(article.issn){
            article.issn = article.issn.replace("-","");
            var publication = Publications.findOne({issn:article.issn});
            if(publication){
                article.publisher= publication.publisher;
                article.journalId =publication._id;
            }else{
                article.errors.push("No such issn found in journal collection: " + issn);
            }
        }else{
            article.errors.push("No issn found in xml")
        }
        return article;
    }
    if(Science.FSE.existsSync(filepath))
        return parse(ScienceXML.getFileContentsFromLocalPath(filepath, 'utf-8'));
}