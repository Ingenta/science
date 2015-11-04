Template.homePageTopicList.helpers({
    topics: function () {
        return Topics.find({"parentId": null});
    },
    searchUrl: function () {
        var option = {
            filterQuery: {
                topic: [this._id]
            },
            setting: {from: 'topic'}
        };
        return SolrQuery.makeUrl(option);
    }
});
