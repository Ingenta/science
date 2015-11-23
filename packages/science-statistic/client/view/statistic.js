Template.statistic.rendered = function () {
    $(document).ready(function() {
        $(".js-example-basic-multiple").select2();
    });
};

Template.statistic.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
        return Publications.find();
    },
    institutionsList:function(){
        return Institutions.find();
    },
    mostReadArticles: function () {
        var journalId = Router.current().params.journalId;

        // 获取更多Id
        Meteor.call("getMostRead", journalId, 20, function (err, result) {
            Session.set("mostReadIds", result);
        });
        var mostReadArticleIdList = Session.get("mostReadIds");
        // 返回article信息，并排序
        if (!Session.get("sort"))return _.map(mostReadArticleIdList, function (id) {
            return Articles.findOne({_id: id})
        })
        return Articles.find({_id: {$in: allId}});

    }
});