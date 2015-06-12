Template.SearchBar.events({
    'click .btn': function(){
        var query = $('#searchInput').val();
        if(query)
            Router.go('/s/'+query);
    }
});
Template.SearchResults.helpers({
    'results': function(){
        var q = Router.current().params.searchQuery;
        if(q)
        {
            var mongoDbArr = [];
            mongoDbArr.push({title: { $regex : q, $options:"i" } });
            mongoDbArr.push({authors: { $regex : q, $options:"i" } });
            return Articles.find({ $or: mongoDbArr});
        }
        var t = Router.current().params.topicQuery;
        if(t)
        {
            return Articles.find({ topic: t});
        }
        var a = Router.current().params.authorQuery;
        return  Articles.find({ authors: a});
    },
    urlToArticle:function(title){
        var article =Articles.findOne({title:title});
        var publisherName = Publishers.findOne({_id:article.publisher}).name;
        var journalName = Publications.findOne({_id:article.journalId}).title;
        return "/publisher/"+publisherName+"/journal/"+journalName+"/article/"+title;
    }
});
