
Meteor.methods({
    "search": function (params) {
        return SolrUtils.search(params);
    }
});
