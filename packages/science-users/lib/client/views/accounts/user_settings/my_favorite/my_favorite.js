Template.UserSettingsMyFavorite.helpers({
    favorite : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.favorite;
    },
    count : function () {
        if(Users.findOne().favorite)
        return Users.findOne().favorite.length;
    }
})

Template.SingleFavorite.helpers({
    article: function(){
        return Articles.findOne({_id: this.articleId});
    }
})

Template.favoriteArticle.helpers({
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