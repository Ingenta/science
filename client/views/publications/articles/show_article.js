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
                    article.keywords.forEach(function (k) {
                        var id = Keywords.findOne({"name": k})._id;
                        Keywords.update({_id: id}, {$inc: {"score": 2}})
                    })
                }
            });
        }
    }
});

var removeArticleFromArray = function (array, articleId) {
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
    //Rating Start
    var aid = this.data._id;
    var arr = this.data.rating || [];
    $('.raty').raty({
        //half: true,
        score: function () {
            if (arr.length > 0) {
                var sum = 0;
                _.each(arr, function (element) {
                    sum += element.score;
                });
                return sum / arr.length;
            } else {
                return 0;
            }
        },
        click: function (score, evt) {
            if (Meteor.userId()) {
                var temp = _.find(arr, function(obj){
                    return obj.user == Meteor.userId();
                });
                if (temp) {
                    arr = _.without(arr, temp);
                }
                arr.push({"user": Meteor.userId(), score: score});
                Articles.update({_id: aid}, {$set: {rating: arr}});
            } else{
                return false;
            }
        }
    });
    //Rating End
});

Template.showArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    },
    getPdfById: function (id) {
        return ArticleXml.findOne({_id: id}).url();
    }
});

Template.articleOptions.helpers({
    context: function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        return Articles.findOne({doi: currentDoi});
    },
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

//        return Session.get('activeTab');
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
        var previousValue = Articles.findOne({doi: {$lt: this.doi}}, {$sort: {doi: -1}});
        if (previousValue) {
            var preVal = previousValue.doi.substring(previousValue.doi.lastIndexOf("/") + 1);
            return preVal;
        }
        return false;
    },
    nextValue: function () {
        var nextValue = Articles.findOne({doi: {$gt: this.doi}}, {$sort: {doi: -1}});
        if (nextValue) {
            var nextVal = nextValue.doi.substring(nextValue.doi.lastIndexOf("/") + 1);
            return nextVal;
        }
        return false;
    }
});


Template.figModal.helpers({
    "label": function () {
        if (!Session.get("fig"))
            return "";
        return Session.get("fig").label;
    },
    "caption": function () {
        if (!Session.get("fig"))
            return;
        return Session.get("fig").caption;
    },
    "img": function () {
        if (!Session.get("fig"))
            return;
        var grap = _.find(Session.get("fig").graphics, function (g) {
            return g.use == 'online';
        });
        return grap.href;
    }
});