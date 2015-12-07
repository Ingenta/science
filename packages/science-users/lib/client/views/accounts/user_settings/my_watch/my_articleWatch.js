Template.ArticleWatch.helpers({
    sbWatch: function () {
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.articlesOfInterest
    },
    ArticleUrl: function (Arid) {//TODO: use helper
        var article = Articles.findOne({_id: Arid});
        var publication = Publications.findOne({_id: article.journalId});
        var publisher = Publishers.findOne({_id: publication.publisher});
        var urls = "/publisher/" + publisher.shortname + "/journal/" + publication.title + "/" + article.volume + "/" + article.issue + "/" + article.doi;
        return urls;
    },
    articleWatch: function () {
        return Articles.findOne({_id: this.toString()})
    }
});

Template.ArticleWatch.events({
    'click .btn': function () {
        var selected = _.pluck($("input[name='selectedArticle']:checked"), 'value');
        var diff = _.difference(Meteor.user().profile ? Meteor.user().profile.articlesOfInterest : undefined, selected);
        Users.update({_id: Meteor.userId()}, {$set: {'profile.articlesOfInterest': diff}});
    }
})
