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

Template.recentArticles.helpers({
    newestArticle: function () {
        return Articles.find({}, {sort: {createdAt: -1}, limit: 5});
    },
    mostReadArticles: function () {
        Meteor.call("getMostRead", Meteor.userId(), function (err, result) {
            Session.set("mostRead", result);
        });

        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];
        most.forEach(function (id) {
            var article = Articles.findOne({_id: id._id.articleId});
            article && mostReadArticles.push(article);
        });
        return mostReadArticles;
    },
    mostCitedArticles: function () {
        return MostCited.find({}, {sort: {count: 1}, limit: 5});
    },
    hasMostCited: function () {
        if (MostCited.find().count())return true;
        return false;
    }
});

AutoForm.addHooks(['addNewsModalForm'], {
    onSuccess: function () {
        $("#addNewsModal").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
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
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    }
}, true);