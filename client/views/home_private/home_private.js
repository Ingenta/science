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
        Meteor.call("getMostRead", Meteor.userId(), function (err, result) {
            Session.set("mostRead", result);
        });

        var most = Session.get("mostRead");
        if (!most)return;

        var resultArray = [];
        most.forEach(function (id) { //TODO: figure out a better way to do this instead of calling the db for each id in the list
            resultArray.push(Articles.findOne({_id: id._id.articleId}));
        });
        return resultArray;
    }
});
