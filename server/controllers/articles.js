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
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
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
    },
    'countSession': function(){
        var c = UserStatus.connections.find().count();
        return c;
    },
    'ipInChina': function () {
        var currentUserIPNumber = Science.ipToNumber(this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress);
        return IP2Country.findOne({startIpLong: {$lte: currentUserIPNumber.toString()}, endIpLong: {$gte: currentUserIPNumber.toString()}, countryCode2: "CN"})? false: true;
    }
});

