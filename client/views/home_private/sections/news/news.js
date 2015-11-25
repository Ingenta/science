Template.NewsList.events({
    'mouseenter .index': function (event) {
        var index = $(event.currentTarget).attr('index');
        $('#myCarousel').carousel(parseInt(index))
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
AutoForm.addHooks(['addNewsModalForm'], {
    onSuccess: function () {
        $("#addNewsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            var newPage = _.contains(Config.Routes.NewsPage.journal, Router.current().route.getName());
            var type = newPage ? 2 : 1;
            doc.types = type;
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

Template.addNewsButton.helpers({
    hasMostThreeNews: function () {
        return News.find({types: "1"}).count() < 3;
    }
});