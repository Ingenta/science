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

Template.mostRecentUpload.helpers({
    newArticle: function () {
        return Articles.find({}, {sort: {createdAt: -1}, limit: 3});
    }
});

Template.SingleNews.helpers({
    hasNews: function (id) {
        return News.find({"news": id}).count() === 0;
    }
});