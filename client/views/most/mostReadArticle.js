Template.sortByDateControl.events({
    'change input.datesort': function (event) {
        Session.set("sort", event.target.value);
    }
});
Template.mostReadArticle.helpers({
    mostReadArticles: function () {
        var mostRead;
        var journalId = Router.current().params.journalId;
        if(journalId){
            mostRead= MostCount.findOne({type:"journalMostRead",journalId:journalId},{sort:{createDate:-1}});
        }else{
            mostRead = MostCount.findOne({type:"homeMostRead"},{sort:{createDate:-1}});
        }
        if(mostRead){
            var mostReadArticleIdList = mostRead.ArticlesId;
        }else{
            // 获取更多Id
            Meteor.call("getMostRead", journalId, 20, function (err, result) {
                Session.set("mostReadIds", result);
            });
            var mostReadArticleIdList = Session.get("mostReadIds");
        }
        // 返回article信息，并排序
        if (!Session.get("sort"))return _.map(mostReadArticleIdList, function (id) {
            return Articles.findOne({_id: id})
        })

        var sort = {"published": Session.get("sort")};
        return Articles.find({_id: {$in: mostReadArticleIdList}}, {sort: sort});

    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});
