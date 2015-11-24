this.SearchHistory= new Meteor.Collection("searchHistory");

this.SearchHistory.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-searchHistory", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-searchHistory", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-searchHistory", "resource", userId);
    }
});

SearchHistorySchema  = new SimpleSchema({
    folderName: {
        type: String
    }
});

Meteor.startup(function(){
    SearchHistorySchema.i18n("schemas.searchHistory");
    SearchHistory.attachSchema(SearchHistorySchema);
})
