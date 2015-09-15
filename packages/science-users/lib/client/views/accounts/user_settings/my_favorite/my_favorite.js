Template.UserSettingsMyFavorite.helpers({
    favorite : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.favorite;
    },
    count : function () {
        return Users.findOne().favorite.length;
    }
})

Template.SingleFavorite.helpers({
    article: function(){
        return Articles.findOne({_id: this.articleId});
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
        confirmDelete(e,function(){
            Articles.remove({_id:articleId});
        });
    }
})