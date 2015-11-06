var Future = Npm.require('fibers/future');

Meteor.methods({
    'distinctVolume': function (journalId) {
        result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
    'grabSessions': function (id) {
        var c = UserStatus.connections.findOne({userId: id});
        return c.ipAddr;
    },
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
        if (!limit)limit = 20;
        var a = undefined;
        if (journalId)
            a = ArticleViews.aggregate([{
                $match: {
                    journalId: journalId
                }
            }, {
                $group: {
                    _id: {articleId: '$articleId'},
                    count: {$sum: 1}
                }
            }, {$sort: {count: -1}}
                , {$limit: limit}]);
        else a = ArticleViews.aggregate([{
            $group: {
                _id: {articleId: '$articleId'},
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
        if (!a)return;
        return a;
    },
    'countSession': function () {
        var c = UserStatus.connections.find().count();
        return c;
    },
    'ipInChina': function () {
        var currentUserIPNumber = Science.ipToNumber(this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress);
        var item = IP2Country.findOne({
            startIpLong: {$lte: currentUserIPNumber},
            endIpLong: {$gte: currentUserIPNumber}
        });
        return IP2Country.findOne({
            startIpLong: {$lte: currentUserIPNumber},
            endIpLong: {$gte: currentUserIPNumber},
            countryCode2: "CN"
        }) ? {code: false, number: currentUserIPNumber, country: item} : {
            code: true,
            number: currentUserIPNumber,
            country: item
        };
    },
    'getLocationReport': function (action, articleId) {
        var countryViews = {};
        var other = {name: {cn: '其他', en: 'Others'}, locationCount: 0};
        ArticleViews.aggregate([{
            $group: {
                _id: {articleId: articleId, action: action, ip: '$ip'},
                count: {$sum: 1}
            }
        }]).forEach(function (item) {
            if (!item._id.ip) {
                other.locationCount += item.count;
            } else {
                var currentUserIPNumber = Science.ipToNumber(item._id.ip)
                var country = IP2Country.findOne({
                        startIpLong: {$lte: currentUserIPNumber},
                        endIpLong: {$gte: currentUserIPNumber}
                    },
                    {fields: {country: 1, countryCode2: 1}}
                );
                if (country) {
                    if (countryViews[country.countryCode2]) {
                        countryViews[country.countryCode2].locationCount += item.count;
                    } else {
                        countryViews[country.countryCode2] = {name: country.country, locationCount: item.count}
                    }
                } else {
                    other.locationCount += item.count;
                }
            }
        });
        countryViews = _.values(countryViews);
        if (other.locationCount > 0)
            countryViews.push(other);
        return countryViews;
    },
    'updateKeywordScore': function (keywords, score) {
        if (_.isEmpty(keywords))
            return;
        var arr = (typeof keywords === 'string') ? [keywords] : keywords;
        var sc = score || 1;

        Keywords.update({name: {$in: arr}}, {$inc: {"score": sc}}, {multi: true});
        return true;
    }
});

