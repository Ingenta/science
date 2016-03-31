
Template.mostReadArticleList.helpers({
    mostReadArticlesTopFive: function () {
        //NOTE: get 6 of each so that more button will show if more than 6 exist
        //homepage
        if(Router.current().route.getName() === "home")
        {
            if(!Session.get("homePageMostReadArticleIds")) {
                Meteor.call("getMostRead", undefined, 6, function (err, result) {
                    Session.set("homePageMostReadArticleIds", result);
                });
            }
            return _.map(Session.get("homePageMostReadArticleIds"), function (id) {
                return Articles.findOne({_id: id})
            });
        }
        else if(this.journalId){
            var journalId = this.journalId;
            if(!Session.get("mostReadIds"+journalId)) {
                Meteor.call("getMostRead", journalId, 6, function (err, result) {
                    Session.set("mostReadIds" + journalId, result);
                });
            }
            return _.map(Session.get("mostReadIds"+journalId), function (id) {
                return Articles.findOne({_id: id})
            });
        }

    },
    hasFiveOrMoreMostReadArticles: function () {
      if (Router.current().route.getName() === "home") {
          if (Session.get("homePageMostReadArticleIds") && Session.get("homePageMostReadArticleIds").length >= 5)return true;
      } else if(this.journalId){
          if (Session.get("mostReadIds"+this.journalId) && Session.get("mostReadIds"+this.journalId).length >= 5)return true;
      }
        return false;
    }
});