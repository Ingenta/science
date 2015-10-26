Template.ArticleWatch.helpers({
    sbWatch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.profile ? user.profile.interestedOfArticles : undefined;
    },
    ArticleUrl: function(Arid){
        var article = Articles.findOne({_id: Arid});
        var publication = Publications.findOne({_id: article.journalId});
        var publisher = Publishers.findOne({_id: publication.publisher});
        var urls = "/publisher/"+publisher.name+"/journal/"+publication.title+"/"+article.volume+"/"+article.issue+"/"+article.doi;
        return urls;
    },
    articleWatch: function(){
        return Articles.findOne({_id: this.toString()})
    }
});

Template.ArticleWatch.events({
    'click .btn': function () {
        var selected = _.pluck($("input[name='selectedArticle']:checked"),'value');
        var diff = _.difference(Meteor.user().profile ? Meteor.user().profile.interestedOfArticles : undefined, selected);
        Users.update({_id: Meteor.userId()}, {$set: {'profile.interestedOfArticles': diff}});
    }
})
