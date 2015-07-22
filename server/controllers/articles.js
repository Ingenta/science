Meteor.methods({
    'distinctVolume': function (journalId) {
        result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
    'grabSessions': function(id){
        var c = UserStatus.connections.findOne({userId:id});
        return c.ipAddr;
    },
    'getClientIP': function(){
        return this.connection.clientAddress;
    },
    'getMostRead': function () {
        var a = ArticleViews.aggregate([{
            $group: {
                _id: {articleId: '$articleId'},
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}]);
        if (!a)return;
        return a;
    }
});

