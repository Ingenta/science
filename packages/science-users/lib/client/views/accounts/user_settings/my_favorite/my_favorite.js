Template.UserSettingsMyFavorite.helpers({
    favorite : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        var i;
        for(i=0;i<=user.favorite.length;i++) {
            return Articles.find({"_id": user.favorite[i]});
        }
    }
})

Template.SingleFavorite.helpers({
    ArticleUrl: function (Arid) {
        var article = Articles.findOne({_id:Arid});
        var publication = Publications.findOne({_id:article.journalId});
        var publisher = Publishers.findOne({_id: publication.publisher});
        var urls = "/publisher/"+publisher.name+"/journal/"+publication.title+"/"+article.volume+"/"+article.issue+"/"+article.doi;
        return urls;
    }
})

Template.favoriteArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    },
    query      : function () {
        return Router.current().params.searchQuery;
    }
});

Template.favoriteArticle.events({
    "click .btn-delete-article": function () {
        var articleId = this._id;
        sweetAlert({
            title             : TAPi18n.__("Warning"),
            text              : TAPi18n.__("Confirm_delete"),
            type              : "warning",
            showCancelButton  : true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText : TAPi18n.__("Do_it"),
            cancelButtonText  : TAPi18n.__("Cancel"),
            closeOnConfirm    : false
        }, function () {
            Articles.remove({_id:articleId});
            sweetAlert({
                title:TAPi18n.__("Deleted"),
                text:TAPi18n.__("Operation_success"),
                type:"success",
                timer:2000
            });
        });
    }
})