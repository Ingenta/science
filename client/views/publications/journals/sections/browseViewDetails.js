Template.articleViewDescription.onRendered(function(){
    if(Router.current().state.get("collapse"+this.data._id)){
        $(this.find(".collapse")).addClass("in")
        $(this.find("i.fa.fa-plus")).removeClass("fa-plus").addClass("fa-minus");
    }
});

Template.articleViewDescription.helpers({
    notEmptyField:function(){
        return !_.isEmpty(this.field) && (this.field.cn || this.field.en);
    },
    getContent: function (field) {
        if (typeof field == "object") {
            if (TAPi18n.getLanguage() === "zh-CN") {
                if (!field.cn)return field.en;
                return field.cn;
            }
            if (!field.en)return field.cn;
            return field.en;
        } else {
            return field;
        }
    },
    islogin:function(){
        return !_.isEmpty(Meteor.userId());
    },
    favoriteName: function () {
        var thisArticle = Articles.findOne({doi: this.doi});
        if (Meteor.userId()&& thisArticle) {
            var listOfUserFavourites = Meteor.user().favorite || [];
            var isAlreadyFavorited = _.find(listOfUserFavourites, function (favorite) {
                return favorite.articleId == thisArticle._id;
            });
            return isAlreadyFavorited ? TAPi18n.__("Favorited") : TAPi18n.__("Favorite");
        }
    },
    browseIpDownloadLimitation: function () {
        //return true;
        if (Permissions.isAdmin())return true;
        if (Session.get("currentJournalLanguage") === "2") return true;
        return Session.get("ipInChina");
    }
});

Template.articleViewDescription.events({
    'hide.bs.collapse .collapse':function(e,t){
        e.stopPropagation();
        Router.current().state.set("collapse"+this._id,false);
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-minus").addClass("fa-plus");
    },
    'show.bs.collapse .collapse':function(e,t){
        e.stopPropagation();
        Router.current().state.set("collapse"+this._id,true);
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-plus").addClass("fa-minus");
    },
    "click .favorite": function (e) {
        e.preventDefault();
        var currentDoi = this.doi;
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
    "click .loginFavorite":function(){
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
    },
    "click .emailThis":function(){
        Session.set('currentDoi', this.doi);
    }
});