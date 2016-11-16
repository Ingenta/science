Template.ArticleWatch.helpers({
    sbWatch: function () {
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.articlesOfInterest
    },
    articleWatch: function () {
        return Articles.findOne({_id: this.toString()})
    },
    articleWatchCount: function(){
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.articlesOfInterest.length > 0;
    }
});

Template.ArticleWatch.events({
    'click .btn': function () {
        var selected = _.pluck($("input[name='selectedArticle']:checked"), 'value');
        var diff = _.difference(Meteor.user().profile ? Meteor.user().profile.articlesOfInterest : undefined, selected);
        Users.update({_id: Meteor.userId()}, {$set: {'profile.articlesOfInterest': diff}});
    }
})
