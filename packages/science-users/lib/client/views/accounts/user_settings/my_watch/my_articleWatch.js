Template.ArticleWatch.helpers({
    sbWatch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.watchArticle;
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
    },
    count : function () {
        if(Users.findOne().watchArticle)
        return Users.findOne().watchArticle.length;
    }
});

Template.ArticleWatch.events({
    'click .btn': function () {
        var selected =  _.pluck($("input[name='selectedArticle']:checked"),'value');
        var diff = _.difference(Meteor.user().watchArticle,selected);
        Users.update({_id:Meteor.userId()},{$set:{watchArticle: diff}});
    }
})
