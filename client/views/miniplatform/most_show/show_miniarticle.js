Template.dynamicArticleShow.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.dynamicArticleShow.helpers({
    mostPublishingArticles: function () {
        var pubSort = {};
        if(Session.get("sort"))
            pubSort = {"published": Session.get("sort")};
        return Articles.find({},{sort:pubSort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});

Template.dynamicArticleShow.onRendered(function () {
    if (Session.get('sort')===undefined) {
        Session.set('sort', "1");
    }
});