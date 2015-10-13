var Future = Npm.require('fibers/future');

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
        var item = IP2Country.findOne({startIpLong: {$lte: currentUserIPNumber}, endIpLong: {$gte: currentUserIPNumber}});
        return IP2Country.findOne({startIpLong: {$lte: currentUserIPNumber}, endIpLong: {$gte: currentUserIPNumber}, countryCode2: "CN"})? {code: false, number: currentUserIPNumber, country: item}: {code: true, number: currentUserIPNumber, country: item};
    },
    'getLocationReport': function (action, articleId) {
        var countryViews = {Others: {name: {cn:'其他', en: 'Others'}, localCount: 0}};
        ArticleViews.find({action: action, articleId: articleId}).forEach(function(item){
            if(!item.ip){
                countryViews['Others'].localCount += 1;
                return;
            }
            var currentUserIPNumber = Science.ipToNumber(item.ip)
            var country = IP2Country.findOne({startIpLong: {$lte: currentUserIPNumber}, endIpLong: {$gte: currentUserIPNumber}});
            if(country){
                if(countryViews[country.countryCode2]){
                    countryViews[country.countryCode2].localCount += 1;
                } else {
                    countryViews[country.countryCode2].name = obj.country;
                    countryViews[country.countryCode2].localCount = 1;
                }
            } else {
                countryViews['Others'].localCount += 1;
            }
        });
        return countryViews;
    }
});

