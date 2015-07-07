ReactiveTabs.createInterface({
    template: 'articleTabs',
    onChange: function (slug, template) {
        if (slug === 'abstract') {
            Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
                var currentTitle = Router.current().params.articleName;
                var articleId = Articles.findOne({title: currentTitle})._id;
                ArticleViews.insert({
                    articleId: articleId,
                    userId: Meteor.userId(),
                    when: new Date(),
                    action: "abstract",
                    ip: session
                });
            });
        } else if (slug === 'full text') {
            Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
                var currentTitle = Router.current().params.articleName;
                var articleId = Articles.findOne({title: currentTitle})._id;
                ArticleViews.insert({
                    articleId: articleId,
                    userId: Meteor.userId(),
                    when: new Date(),
                    action: "fulltext",
                    ip: session
                });
            });
        }
    }
})
;

Template.showArticle.onRendered(function () {
    var rva = Session.get("recentViewedArticles");
    if (!rva) {
        rva = [];
    } else if (_.findWhere(rva, {_id: this.data._id})) {
        var temp = [];
        while (rva.length) {
            var oneId = rva.shift();
            if (oneId._id != this.data._id) {
                temp.push(oneId);
            }
        }
        rva = temp;
    } else if (rva.length == 3) {
        rva.pop();
    }
    rva.unshift({_id: this.data._id});
    Session.set("recentViewedArticles", rva);
});

Template.showArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        return this.surname + ' ' + this.given;
    }
});

Template.articleOptions.helpers({
    context: function () {
        var currentTitle = Router.current().params.articleName;
        return Articles.findOne({title: currentTitle});
    }
});

Template.articleOptions.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Abstract"), slug: 'abstract'},
            {name: TAPi18n.__("Full Text"), slug: 'full text'},
            {name: TAPi18n.__("References") + "(" + this.references.length + ")", slug: 'references'},
            {name: TAPi18n.__("Cited By"), slug: 'cited by'},
            {name: TAPi18n.__("Data & Media"), slug: 'data media'},
            {name: TAPi18n.__("Metrics"), slug: 'metrics'},
            {name: TAPi18n.__("Related"), slug: 'related'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});
Template.showArticle.events({
    'click .pdfDownload': function () {
        ArticleViews.insert({
            articleId: this._id,
            userId: Meteor.userId(),
            when: new Date(),
            action: "pdfDownload"
        })
    }
});

Template.articlePage.helpers({
    preTitle: function () {
        var previousValue= Articles.findOne({doi:{$lt:this.doi}},{$sort:{doi:-1}});
        if(previousValue){
            return previousValue.title;
        }
        return false;
    },
    nextTitle: function () {
        var nextValue= Articles.findOne({doi:{$gt:this.doi}},{$sort:{doi:-1}});
        if(nextValue){
            return nextValue.title;
        }
        return false;
    }
});
