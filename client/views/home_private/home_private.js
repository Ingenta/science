Template.HomePrivate.rendered = function () {

};

Template.NewsList.events({
    'mouseenter .index': function (event) {
        var index = $(event.currentTarget).attr('index');
        $('#myCarousel').carousel(parseInt(index))
    }
});

Template.HomePrivate.helpers({
    hasMostThreeNews: function () {
        return News.find({types: "1"}).count() < 3;
    }
});

Template.NewsList.helpers({
    news: function (type) {
        var n = News.find({types: "1"}, {limit: 3});
        if (type == 'extend') {
            n = n.map(function (newsItem, index) {
                newsItem.index = index;
                newsItem.class = index == 0 ? "active" : "";
                return newsItem;
            });
            if (Session.get("renderd")) {
                var nums = $(".index-num");
                _.each(nums, function (item, index) {
                    $(item).attr('index', index);
                });
                $(".carousel-inner .item").removeClass("next").removeClass("left");
                var item = $(".carousel-inner .item");
                if (item && item.length) {
                    $(item[0]).addClass('active');
                }
                var indicators = $(".carousel-indicators li");
                if (indicators && indicators.length) {
                    $(indicators[0]).addClass('active');
                }
            }
        }
        return n;
    }
});

Template.NewsList.onRendered(function () {
    Session.set("renderd", true);
});

Template.SingleNews.helpers({
    hasMoreThanOneNews: function () {
        return News.find({types: "1"}).count() > 1;
    },
    whichUrl: function () {
        if (this.url) {
            return this.url;
        }
        return "/news/" + this._id;
    }
});


Template.SingleNews.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            News.remove({_id: id});
        })
    }
});

Template.latestUploadedArticleList.helpers({
    latestUploadedArticles: function () {
        return Articles.find({}, {sort: {createdAt: -1}, limit: 10});
    }
});

Template.mostReadArticleList.helpers({
    mostReadArticles: function () {
        Meteor.call("getMostRead", Meteor.userId(), function (err, result) {
            Session.set("mostRead", result);
        });
        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];
        var journalId = this.journalId
        most.forEach(function (id) {
            var article = undefined;
            if(journalId) article = Articles.findOne({_id: id._id.articleId, journalId: journalId});
            else article = Articles.findOne({_id: id._id.articleId});
            article && mostReadArticles.push(article);
        });
        return _.first(mostReadArticles,[5]);
    }
});

Template.mostCitedArticleList.helpers({
    mostCitedArticles: function () {
        if(this.journalId) return MostCited.find({journalId: this.journalId}, {sort: {count: 1}, limit: 5});
        return MostCited.find({}, {sort: {count: 1}, limit: 5});
    },
    mostCiteCount: function () {
        if(5 < MostCited.find().count()){
            return true;
        }else{
            return false;
        }
    }
});

Template.homePgaeTopicList.helpers({
    topics: function () {
        return Topics.find({"parentId": null});
    },
    searchUrl: function(){
        var option = {
            filterQuery:{
                topic:[this._id]
            },
            setting:{from:'topic'}
        };
        return SolrQuery.makeUrl(option);
    }
});

AutoForm.addHooks(['addNewsModalForm'], {
    onSuccess: function () {
        $("#addNewsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            var newPage = _.contains(Config.NewsPage.journal, Router.current().route.getName());
            var type = newPage ? 2 : 1;
            doc.types = type;
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);