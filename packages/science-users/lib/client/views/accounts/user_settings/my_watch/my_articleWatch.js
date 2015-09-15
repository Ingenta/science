Template.ArticleWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.watchArticle;
    }
})

Template.SingleArticleWatch.helpers({
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
})