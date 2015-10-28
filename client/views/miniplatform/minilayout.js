Template.miniLayout.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            SolrQuery.search({query:sword,setting:{from:"bar"}});
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                SolrQuery.search({query:sword,setting:{from:"bar"}});
            }
        }
    }
})