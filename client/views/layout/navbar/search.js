Template.SearchBar.events({
    'click .btn': function(){
        var query = $('#searchInput').val();
        Router.go('/s/'+query);
    }
});
