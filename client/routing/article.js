Router.route('/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue/:publisherDoi/:articleDoi', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        Session.set("activeTab", "full text");
        if (pub) {
            journal && Session.set('currentJournalId', journal._id);
            pub && Session.set('currentPublisherId', pub._id);
            Session.set('currentDoi', this.params.publisherDoi + "/" + this.params.articleDoi);
            return Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
        }
    },
    template: "showArticle",
    title: function () {
        return TAPi18n.__("Article");
    },
    parent: "journal.name.toc",
    name: "article.show",
    waitOn: function () {
        return [
            Meteor.subscribe('getAllIssuesMatchingThisOneForNextAndPrevious', this.params.publisherDoi + "/" + this.params.articleDoi),
            Meteor.subscribe('journalIssues', this.params.journalShortTitle),
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi),
            Meteor.subscribe('oneArticleKeywords', this.params.publisherDoi + "/" + this.params.articleDoi),
            Meteor.subscribe('oneArticleFigures', this.params.publisherDoi + "/" + this.params.articleDoi),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files'),
            Meteor.subscribe('journalMostReadBrief', this.params.journalShortTitle),
            Meteor.subscribe('journalMostCitedBrief', this.params.journalShortTitle)
        ]
    },
    onBeforeAction: function () {
        //if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
        //    Meteor.call("getLocationByCurrentIP", function (err, result) {
        //        if (!result)console.log("ip not found.");
        //        else {
        //            console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
        //            Session.set("ipInChina", result.country_code === "CN");
        //        }
        //    })
        //}
        if (!_.isEmpty(this.data().affiliations) && this.data().affiliations.length == 1) Session.set("hideAffLabel", true);
        else Session.set("hideAffLabel", false);

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
        Session.set("activeTab", "full text");
        if (pub) {
            journal && Session.set('currentJournalId', journal._id);
            pub && Session.set('currentPublisherId', pub._id);
            Session.set('currentDoi', this.params.publisherDoi + "/" + this.params.articleDoi);
            return Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
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
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi),
            Meteor.subscribe('oneArticleKeywords', this.params.publisherDoi + "/" + this.params.articleDoi),
            Meteor.subscribe('oneArticleFigures', this.params.publisherDoi + "/" + this.params.articleDoi),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files'),
            Meteor.subscribe('journalMostRead', this.params.journalShortTitle),
            Meteor.subscribe('journalMostCited', this.params.journalShortTitle)
        ]
    },
    onBeforeAction: function () {
        //if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
        //    Meteor.call("getLocationByCurrentIP", function (err, result) {
        //        if (!result)console.log("ip not found.");
        //        else {
        //            console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
        //            Session.set("ipInChina", result.country_code === "CN");
        //        }
        //    })
        //}
        if (!_.isEmpty(this.data().affiliations) && this.data().affiliations.length == 1) Session.set("hideAffLabel", true);
        else Session.set("hideAffLabel", false);

        this.next();
    },
    onStop: function () {
        Meteor.clearInterval(Session.get("dynamicRender"));
    }
});

Router.route('/doi/:publisherDoi/:articleDoi', function () {
    var article = Articles.findOne(
        {doi: this.params.publisherDoi + "/" + this.params.articleDoi},
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
        console.log(this.params.publisherDoi + "/" + this.params.articleDoi + ' doi not found, redirecting to homepage')
        this.redirect('home')
    }
    else if (article.pubStatus === "normal") {
        var journal = Publications.findOne({_id: article.journalId}, {fields: {shortTitle: 1}});
        var pub = Publishers.findOne({_id: article.publisher}, {fields: {shortname: 1}});
        this.redirect('article.show', {
            publisherName: pub.shortname,
            journalShortTitle: journal.shortTitle,
            volume: article.volume,
            issue: article.issue,
            publisherDoi: this.params.publisherDoi,
            articleDoi: this.params.articleDoi
        });
    }
    else {
        var journal = Publications.findOne({_id: article.journalId}, {fields: {shortTitle: 1}});
        var pub = Publishers.findOne({_id: article.publisher}, {fields: {shortname: 1}});
        this.redirect('article.show.strange', {
            publisherName: pub.shortname,
            journalShortTitle: journal.shortTitle,
            publisherDoi: this.params.publisherDoi,
            articleDoi: this.params.articleDoi
        });
    }


}, {
    waitOn: function () {
        return [
            Meteor.subscribe('oneArticleByDoi', this.params.publisherDoi + "/" + this.params.articleDoi),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files')
        ]
    }
});