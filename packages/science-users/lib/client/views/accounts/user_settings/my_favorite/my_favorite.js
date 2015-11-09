Template.UserSettingsMyFavorite.helpers({
    favorite: function () {
        var user = Users.findOne({_id: Meteor.userId()});
        return user.favorite;
    }
})

Template.SingleFavorite.helpers({
    article: function () {
        return Articles.findOne({_id: this.articleId});
    }
})

Template.favoriteArticle.helpers({
    query: function () {
        return Router.current().params.searchQuery;
    }
});

Template.favoriteArticle.events({
    'click .fa-trash': function (e) {
        e.articleId = this._id
        confirmDelete(e, function () {
            var tempArray = Meteor.user().favorite;
            var resultArray = _.filter(tempArray, function (element) {
                return element.articleId !== e.articleId
            })
            Users.update({_id: Meteor.userId()}, {$set: {'favorite': resultArray}});
        })
    }
})