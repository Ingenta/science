Template.HomePrivate.rendered = function () {

};

Template.NewsList.events({
    'mouseenter .index': function (event) {
        var index = $(event.currentTarget).attr('index');
        $('#myCarousel').carousel(parseInt(index))
    }
});

Template.HomePrivate.helpers({});


Template.NewsList.helpers({
    news: function () {
        return News.find();
    }
});

Template.deleteNewsModalForm.helpers({
    getPrompt: function () {
        return TAPi18n.__("Are you sure?");
    }
});

Template.recentArticles.helpers({
    newestArticle: function () {
        return Articles.find({}, {sort: {createdAt: -1}, limit: 3});
    },
    mostReadArticles: function () {
        return Articles.find({}, {sort: {createdAt: -1}, limit: 3});
    }
});
