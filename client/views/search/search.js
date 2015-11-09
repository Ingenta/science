Template.SearchBar.events({
    'click .btn': function () {
        var query = $('#searchInput').val();
        if (query)
            Router.go('/s/' + query);
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var query = $('#searchInput').val();
            if (query)
                Router.go('/s/' + query);
        }
    }
});