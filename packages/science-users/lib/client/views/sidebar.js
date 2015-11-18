Template.LayoutSideBar.helpers({
    institutionLogo: function () {
        var logo = undefined;
        var institutuion = undefined;
        if (Meteor.user() && Meteor.user().institutionId) {
            institutuion = Institutions.findOne({_id: Meteor.user().institutionId});
        } else {
            var currentUserIPNumber = Session.get("currentUserIPNumber");
            if (currentUserIPNumber === undefined) {
                Meteor.call("getClientIP", function (err, ip) {
                    currentUserIPNumber = Science.ipToNumber(ip);
                    Session.set("currentUserIPNumber", currentUserIPNumber);
                });
            }
            institutuion = Institutions.findOne({
                ipRange: {
                    $elemMatch: {
                        startNum: {$lte: currentUserIPNumber},
                        endNum: {$gte: currentUserIPNumber}
                    }
                }
            });
        }
        if (institutuion) {
            logo = Images && institutuion.logo && Images.findOne({_id: institutuion.logo}).url();
        }
        if (logo) return '<img src="' + logo + '" width="100%" height="auto"/>';
        else return;
    },
    canUseAdminPanel: function () {
        //return !!_.without(Permissions.getUserRoles(), ["institution:institution-manager-from-user"]).length;
        return _.contains(Permissions.getUserRoles(), "permissions:admin");
    },
    canUseInstitutionPanel: function () {
        return _.contains(Permissions.getUserRoles(), "institution:institution-manager-from-user") && !_.contains(Permissions.getUserRoles(), "permissions:admin");
    },
    canUsePublisherPanel: function () {
        return _.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user") && !_.contains(Permissions.getUserRoles(), "permissions:admin");
    },
    isArticlePage: function () {
        if (Router.current() && Router.current().route)
            return Router.current().route.getName() == "article.show";
    },
    isJournalPage: function () {
        if (Router.current() && Router.current().route)
            if (Router.current().route.getName() == "journal.name" || Router.current().route.getName() == "journal.name.toc")
                return true;
    },
    getCurrentDoi: function () {
        return Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
    },
    favoriteName: function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var thisArticle = Articles.findOne({doi: currentDoi});
        if (Meteor.userId() && currentDoi && thisArticle) {
            var listOfUserFavourites = Meteor.user().favorite || [];
            var isAlreadyFavorited = _.find(listOfUserFavourites, function (favorite) {
                return favorite.articleId == thisArticle._id;
            });
            return isAlreadyFavorited ? TAPi18n.__("Favorited") : TAPi18n.__("Favorite");

        }
    },
    articleWatchState: function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if (Meteor.userId() && article) {
            var wat = [];
            if (Meteor.user().profile) {
                wat = Meteor.user().profile.interestedOfArticles || [];
            }
            return _.contains(wat, article._id) ? TAPi18n.__("Watched") : TAPi18n.__("Article Watch");
        } else {
            return TAPi18n.__("Article Watch");
        }
    },
    journalWatchState: function () {
        var currentTitle = Router.current().params.journalShortTitle;
        var journal = Publications.findOne({shortTitle: currentTitle});
        if (Meteor.userId() && journal) {
            if (!Meteor.user().profile)return TAPi18n.__("Journal Watch");
            var pro = Meteor.user().profile.interestedOfJournals || [];
            return _.contains(pro, journal._id) ? TAPi18n.__("Watched") : TAPi18n.__("Journal Watch");
        } else {
            return TAPi18n.__("Journal Watch");
        }
    },
    showAccessKey: function () {
        if (!Router.current().route)return false;
        return _.contains(Config.AccessKey, Router.current().route.getName());
    },
    scholarOne: function () {
        return Config.url.ScholarOne;
    },
    editors: function () {
        return Config.url.Editors;
    }
});

Template.LayoutSideBar.events({
    "click .favorite": function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if (Meteor.userId()) {
            var fav = Meteor.user().favorite || [];
            var existObj = _.find(fav, function (obj) {
                return obj.articleId == article._id;
            });
            if (existObj) {
                fav = _.without(fav, existObj)
            } else {
                fav.push({articleId: article._id, createOn: new Date()})
            }
            Users.update({_id: Meteor.userId()}, {$set: {favorite: fav}});
        }
    },
    "click .watchArticle": function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if (Meteor.userId()) {
            var wat = [];
            if (Meteor.user().profile) {
                wat = Meteor.user().profile.interestedOfArticles || [];
            }
            if (_.contains(wat, article._id)) {
                wat = _.without(wat, article._id)
            } else {
                wat.push(article._id)
            }
            Users.update({_id: Meteor.userId()}, {$set: {'profile.interestedOfArticles': wat}});
        }
    },
    "click .watch": function () {
        var currentTitle = Router.current().params.journalShortTitle;
        var journal = Publications.findOne({shortTitle: currentTitle});
        if (Meteor.userId()) {
            var pro = [];
            if (Meteor.user().profile) {
                pro = Meteor.user().profile.interestedOfJournals || [];
            }
            if (_.contains(pro, journal._id)) {
                pro = _.without(pro, journal._id)
            } else {
                pro.push(journal._id)
            }
            Users.update({_id: Meteor.userId()}, {$set: {"profile.interestedOfJournals": pro}});
        }
    }
})