Router.route('/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue/:publisherDoi/:articleDoi', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        Science.setActiveTabByUrl(window.location.search,["abstract","full text","references","cited by","data media","metrics","related","moop"],"full text");
        if (pub) {
            journal && Session.set('currentJournalId', journal._id);
            pub && Session.set('currentPublisherId', pub._id);
            Session.set('currentDoi', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/"));
            var article = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(article && _.contains(journal.tabSelections,"MOOP")){
                article.hasMoop=true;
            }
            if(article){
                Session.set("articleTitle",TAPi18n.getLanguage() === "en" ? article.title.en:article.title.cn)
                article.journal=journal;
            }
            return article;
        }
    },
    template: "showArticle",
    title: function () {
        return Session.get("articleTitle");
    },
    parent: "journal.name",
    name: "article.show",
    waitOn: function () {
        return [
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")),
            Meteor.subscribe('oneArticleKeywords', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")),
            Meteor.subscribe('oneArticleFigures', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files'),
            JournalSubs.subscribe('JournalAdvertisementShowPage',this.params.journalShortTitle),
            Meteor.subscribe('journalMostReadArticle', Session.get('currentJournalId')),
            Meteor.subscribe('journalMostCitedBrief', this.params.journalShortTitle)
        ]
    },
    onBeforeAction: function () {
        Session.set('moopFile',null);
        if (Permissions.isAdmin()){
        }else{
            if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
                Meteor.call("getLocationByCurrentIP", function (err, result) {
                    if (!result)console.log("ip not found.");
                    else {
                        //console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
                        Session.set("ipInChina", result.country_code === "CN");
                    }
                })
            }
        }
        var articledata = this.data();
        if (!_.isEmpty(articledata.affiliations) && articledata.affiliations.length == 1) Session.set("hideAffLabel", true);
        else Session.set("hideAffLabel", false);
        jiathis_config=Science.dom.jiathisShare(articledata,["en","cn"][articledata.journal.language-1]);
        this.next();
    },
    onStop: function () {
        Meteor.clearInterval(Session.get("dynamicRender"));
    }
});

Router.route('/publisher/:publisherName/journal/:journalShortTitle/doi/:publisherDoi/:articleDoi', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (pub) {
            journal && Session.set('currentJournalId', journal._id);
            pub && Session.set('currentPublisherId', pub._id);
            Session.set('currentDoi', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/"));
            var article= Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(article && _.contains(journal.tabSelections,"MOOP")){
                article.hasMoop=true;
            }
            article && (article.journal=journal);
            return article
        }
    },
    template: "showArticle",
    title: function () {
        return TAPi18n.__("Article");
    },
    parent: "journal.name",
    name: "article.show.strange",
    waitOn: function () {
        return [
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")),
            Meteor.subscribe('oneArticleKeywords', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")),
            Meteor.subscribe('oneArticleFigures', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files'),
            JournalSubs.subscribe('JournalAdvertisementShowPage',this.params.journalShortTitle),
            Meteor.subscribe('journalMostReadArticle', Session.get('currentJournalId')),
            Meteor.subscribe('journalMostCitedBrief', this.params.journalShortTitle)
        ]
    },
    onBeforeAction: function () {
        if (Permissions.isAdmin()){
        }else{
            if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
                Meteor.call("getLocationByCurrentIP", function (err, result) {
                    if (!result)console.log("ip not found.");
                    else {
                        //console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
                        Session.set("ipInChina", result.country_code === "CN");
                    }
                })
            }
        }
        var articledata=this.data();
        if (!_.isEmpty(articledata.affiliations) && articledata.affiliations.length == 1) Session.set("hideAffLabel", true);
        else Session.set("hideAffLabel", false);
        Session.set("activeTab", _.isEmpty(articledata.sections)?"abstract":"full text");
        jiathis_config=Science.dom.jiathisShare(articledata,["en","cn"][articledata.journal.language-1]);
        this.next();
    },
    onStop: function () {
        Meteor.clearInterval(Session.get("dynamicRender"));
    }
});

Router.route('/doi/:publisherDoi/:articleDoi', function () {
    var article = Articles.findOne(
        {doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")},
        {
            fields: {
                journalId: 1,
                publisher: 1,
                volume: 1,
                issue: 1,
                pubStatus: 1
            }
        }
    );
    if (!article) {
        console.log(this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/") + ' doi not found, redirecting to homepage')
        return Router.go('home')
    }
    var journal = Publications.findOne({_id: article.journalId}, {fields: {shortTitle: 1}});
    var pub = Publishers.findOne({_id: article.publisher}, {fields: {shortname: 1}});
    if (article.pubStatus === "normal") {
        Router.go('article.show', {
            publisherName: pub.shortname,
            journalShortTitle: journal.shortTitle,
            volume: article.volume,
            issue: article.issue,
            publisherDoi: this.params.publisherDoi,
            articleDoi: this.params.articleDoi
        }, {replaceState: true});
    }
    else {
        Router.go('article.show.strange', {
            publisherName: pub.shortname,
            journalShortTitle: journal.shortTitle,
            publisherDoi: this.params.publisherDoi,
            articleDoi: this.params.articleDoi
        }, {replaceState: true});
    }

}, {
    waitOn: function () {
        return [
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/"))
        ]
    }
});

Router.route('/doi/:publisherDoi/:articleDoi/:secArticleDoi', function () {
    Router.go("/doi/"+this.params.publisherDoi + "/" + this.params.articleDoi+"-slash-"+this.params.secArticleDoi);
});