Template.latestArticles.helpers({
    urlToArticle:function(title){
    	console.log(title);
        var article =Articles.findOne({title:title});
        var publisherName = Publishers.findOne({_id:article.publisher}).name;
        var journalName = Publications.findOne({_id:article.journalId}).title;
        return "/publisher/"+publisherName+"/journal/"+journalName+"/article/"+title;
    }
});