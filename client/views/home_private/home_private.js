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
        return News.find().count() < 3;
    }
});


Template.NewsList.helpers({
    news: function () {
        return News.find({}, {limit: 3}).map(function(newsItem, index) {
            newsItem.index = index;
            return newsItem;
        });
    },
    addActiveClass: function(index) {
        if(!index){
            return "active";
        }
    }
});

Template.NewsList.onRendered(function(){
    var nums =  $(".index-num");
    _.each(nums,function(item,index){
        $(item).attr('index',index);
    });
    var item = $(".carousel-inner .item");
    if(item && item.length){
        $(item[0]).addClass('active');
    }
});

Template.SingleNews.helpers({
    hasMoreThanOneNews: function () {
        return News.find().count() > 1;
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

AutoForm.addHooks(['addNewsModalForm'], {
    onSuccess: function () {
        $("#addNewsModal").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    }
}, true);

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    }
}, true);