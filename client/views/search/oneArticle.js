Template.oneArticle.events({
    'click .onup': function(event){
        $(event.target).next("ul").toggle();
    }
});
Template.oneArticle.helpers({
    urlToArticle:function(title){
        var article =Articles.findOne({title:title});
        var publisherName = Publishers.findOne({_id:article.publisher}).name;
        var journalName = Publications.findOne({_id:article.journalId}).title;
        return "/publisher/"+publisherName+"/journal/"+journalName+"/article/"+title;
    },
    urlToJournal:function(title){
        var article =Articles.findOne({title:title});
        var publisherName = Publishers.findOne({_id:article.publisher}).name;
        var journalName = Publications.findOne({_id:article.journalId}).title;
        return "/publisher/"+publisherName+"/journal/"+journalName;
    },
    journalName:function(id){
        return Publications.findOne({_id:id}).title;
    },
    getFullName:function(){
        return this.surname + ' ' + this.given;
    }
});
