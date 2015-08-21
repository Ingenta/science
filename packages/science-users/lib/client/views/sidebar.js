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
    isJourmalPage: function () {
        return Router.current().route.getName()=="journal.name";
    },
    favoriteName: function(){
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        if(Meteor.userId()){
            var fav = Meteor.user().favorite || [];
            return _.contains(fav, article._id)?TAPi18n.__("Favorited"):TAPi18n.__("Favorite");
        }
    },
    watchName: function(){
        var currentTitle = Router.current().params.journalTitle;
        var journal = Publications.findOne({title: currentTitle});
        if(Meteor.userId()){
            var wat = Meteor.user().watch || [];
            return _.contains(wat, journal._id)?TAPi18n.__("Watched"):TAPi18n.__("Journal Watch");
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
    },
    "click .watch": function(){
        var currentTitle = Router.current().params.journalTitle;
        var journal = Publications.findOne({title: currentTitle});
        if(Meteor.userId()){
            var wat = Meteor.user().watch || [];
            if(_.contains(wat, journal._id)){
                wat = _.without(wat, journal._id)
            }else{
                wat.push(journal._id)
            }
            Users.update({_id: Meteor.userId()},{$set:{watch: wat}});
        }
}
})