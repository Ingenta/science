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
        var mongoDbArr = [];
        mongoDbArr.push({title: { $regex : q, $options:"i" } });
        mongoDbArr.push({authors: { $regex : q, $options:"i" } });
        return Articles.find({ $or: mongoDbArr});
    }
});
