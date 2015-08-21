Template.LayoutSideBar.helpers({
    institutionLogo: function () {
        var currentUserIPNumber = Session.get("currentUserIPNumber");
        if (currentUserIPNumber === undefined) {
            Meteor.call("getClientIP", function (err, ip) {
                currentUserIPNumber = Science.ipToNumber(ip);
                Session.set("currentUserIPNumber", currentUserIPNumber);
            });
        }
        var logo = undefined;
        var institutuion = Institutions.findOne({ipRange: {$elemMatch: {startNum: {$lte: currentUserIPNumber}, endNum: {$gte: currentUserIPNumber}}}});
        if (institutuion) {
            logo = Images && institutuion.logo && Images.findOne({_id: institutuion.logo}).url();
        }
        if (logo) return '<img src="' + logo + '" width="100%" height="auto"/>';
        else return;
    },
    canUseAdminPanel: function () {
        return !!Permissions.getUserRoles().length;
    },
    isArticlePage: function () {
        return Router.current().route.getName()=="article.show";
    },
    favoriteName: function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId()){
            var fav = Meteor.user().favorite || [];
            return _.contains(fav, article._id)?TAPi18n.__("Favorited"):TAPi18n.__("Favorite");
        }
    }
});

Template.LayoutSideBar.events({
    "click .favorite": function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId()){
            var fav = Meteor.user().favorite || [];
            if(_.contains(fav, article._id)){
                fav = _.without(fav, article._id)
            }else{
                fav.push(article._id)
            }
            Users.update({_id: Meteor.userId()},{$set:{favorite: fav}});
        }
    }
})