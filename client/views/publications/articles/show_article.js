ReactiveTabs.createInterface({
    template: 'articleTabs',
    onChange: function (slug, template) {
        if (slug === 'abstract') {
            Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
                var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
                var article = Articles.findOne({doi: currentDoi});
                if (article) {
                    ArticleViews.insert({
                        articleId: article._id,
                        userId: Meteor.userId(),
                        when: new Date(),
                        action: "abstract",
                        ip: session
                    });
                }
            });
        } else if (slug === 'full text') {
            Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
                var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
                var article = Articles.findOne({doi: currentDoi});
                if (article) {
                    ArticleViews.insert({
                        articleId: article._id,
                        userId: Meteor.userId(),
                        when: new Date(),
                        action: "fulltext",
                        ip: session
                    });
                }
            });
        }
    }
});

var removeArticleFromArray = function (array,articleId) {
    var temp = [];
    while (array.length) {
        var oneId = array.shift();
        if (oneId._id != articleId) {
            temp.push(oneId);
        }
    }
    return temp;
};

Template.showArticle.onRendered(function () {
    var rva = Session.get("recentViewedArticles");
    if (!rva) {
        rva = [];
    } else if (_.findWhere(rva, {_id: this.data._id})) {
        rva = removeArticleFromArray(rva, this.data._id);
    } else if (rva.length == 3) {
        rva.pop();
    }
    rva.unshift({_id: this.data._id});//add a article to array[0]
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
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        return Articles.findOne({doi: currentDoi});
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
    preValue: function () {
        var previousValue= Articles.findOne({doi:{$lt:this.doi}},{$sort:{doi:-1}});
        if(previousValue){
            var preVal = previousValue.doi.substring(previousValue.doi.lastIndexOf("/") + 1);
            return preVal;
        }
        return false;
    },
    nextValue: function () {
        var nextValue= Articles.findOne({doi:{$gt:this.doi}},{$sort:{doi:-1}});
        if(nextValue){
            var nextVal = nextValue.doi.substring(nextValue.doi.lastIndexOf("/") + 1);
            return nextVal;
        }
        return false;
    }
});


Template.figModal.helpers({
    "label":function(){
        if(!Session.get("fig"))
            return "";
        return Session.get("fig").label;
    },
    "caption":function(){
        if(!Session.get("fig"))
            return;
        return Session.get("fig").caption;
    },
    "img":function(){
        if(!Session.get("fig"))
            return;
        var grap = _.find(Session.get("fig").graphics,function(g){
            return g.use == 'online';
        });
        return grap.href;
    }
});