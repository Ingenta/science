Template.exportCitationSidebar.helpers({
    getCurrentDoi: function () {
        return Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
    }
})
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
            logo = Images && institutuion.logo && Images.findOne({_id: institutuion.logo})&& CDN.get_cdn_url() + Images.findOne({_id: institutuion.logo}).url({auth:false});
        }
        if (logo) return '<img src="' + logo + '" width="100%" height="auto"/>';
        else return;
    },
    canUseAdminPanel: function () {
        return Meteor.user().level === Permissions.level.admin && Permissions.userCan("use-admin-panel", 'platform');
    },
    canUseInstitutionPanel: function () {
        return Meteor.user().level === Permissions.level.institution && Permissions.userCan("use-institution-panel", 'platform', Meteor.userId(), {institution: Meteor.user().institutionId});
    },
    canUsePublisherPanel: function () {
        return (Meteor.user().level === Permissions.level.publisher || Meteor.user().level === Permissions.level.journal) && Permissions.userCan("use-publisher-panel", 'platform', Meteor.userId(), {publisher: "any"});
    },
    isArticlePage: function () {
        if (Router.current() && Router.current().route)
            return Router.current().route.getName() == "article.show" || Router.current().route.getName() == "article.show.strange";
    },
    getdoi:function(){
        if (Router.current() && Router.current().route
            && Router.current().route.getName() == "article.show" || Router.current().route.getName() == "article.show.strange"){
            return Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi.replace(/-slash-/g,"/");
        }
    },
    isJournalPage: function () {
        if (Router.current() && Router.current().route)
            return _.contains(["journal.name","journal.name.long"],Router.current().route.getName())
    },
    favoriteName: function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi.replace(/-slash-/g,"/");
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
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi.replace(/-slash-/g,"/");
        var article = Articles.findOne({doi: currentDoi});
        if (Meteor.userId() && article) {
            var wat = [];
            if (Meteor.user().profile) {
                wat = Meteor.user().profile.articlesOfInterest || [];
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
            var pro = Meteor.user().profile.journalsOfInterest || [];
            return _.contains(pro, journal._id) ? TAPi18n.__("Watched") : TAPi18n.__("Journal Watch");
        } else {
            return TAPi18n.__("Journal Watch");
        }
    },
    showAccessKey: function () {
        if (!Router.current().route)return false;
        return _.contains(Config.Routes.AccessKey, Router.current().route.getName());
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
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi.replace(/-slash-/g,"/");
        var article = Articles.findOne({doi: currentDoi});
        if (Meteor.userId() && article) {
            var fav = Meteor.user().favorite || [];
            var existObj = _.find(fav, function (obj) {
                return obj.articleId == article._id;
            });
            if (existObj) {
                fav = _.without(fav, existObj)
            } else {
                fav.push({articleId: article._id, createOn: new Date()})

                Meteor.call("insertAudit", Meteor.userId(), "favourite", article.publisher, article.journalId, article._id, function (err, response) {
                    if (err) console.log(err);
                });
            }
            Users.update({_id: Meteor.userId()}, {$set: {favorite: fav}});
        }
    },
    "click .watchArticle": function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi.replace(/-slash-/g,"/");
        var article = Articles.findOne({doi: currentDoi});
        if (Meteor.userId() && article) {
            var wat = [];
            if (Meteor.user().profile) {
                wat = Meteor.user().profile.articlesOfInterest || [];
            }
            if (_.contains(wat, article._id)) {
                wat = _.without(wat, article._id)
            } else {
                wat.push(article._id)

                Meteor.call("insertAudit", Meteor.userId(), "watchArticle", article.publisher, article.journalId, article._id, function (err, response) {
                    if (err) console.log(err);
                });
            }
            Users.update({_id: Meteor.userId()}, {$set: {'profile.articlesOfInterest': wat}});
        }
    },
    "click .watchJournal": function () {
        var currentTitle = Router.current().params.journalShortTitle;
        var journal = Publications.findOne({shortTitle: currentTitle});
        if (Meteor.userId()) {
            var pro = [];
            if (Meteor.user().profile) {
                pro = Meteor.user().profile.journalsOfInterest || [];
            }
            if (_.contains(pro, journal._id)) {
                pro = _.without(pro, journal._id)
            } else {
                pro.push(journal._id);

                Meteor.call("insertAudit", Meteor.userId(), "watchJournal", journal.publisher, journal._id, function (err, response) {
                    if (err) console.log(err);
                });
            }
            Users.update({_id: Meteor.userId()}, {$set: {"profile.journalsOfInterest": pro}});
        }else{
            sweetAlert({
                title             : TAPi18n.__("signInOrRegister"),
                text              : TAPi18n.__("signInFirst"),
                type              : "info",
                showCancelButton  : false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText : TAPi18n.__("OK"),
                closeOnConfirm    : true
            });
            return false;
        }
    }
})