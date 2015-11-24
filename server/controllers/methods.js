getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;
    var a = undefined;
    if (journalId)
        a = PageViews.aggregate([{
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
    else a = PageViews.aggregate([{
        $group: {
            _id: {articleId: '$articleId'},
            count: {$sum: 1}
        }
    }, {$sort: {count: -1}}
        , {$limit: limit}]);
    if (!a)return;
    return a;
}
getMostReadSuggestion = function (currentJournalId) {
    //add suggestion if journalId not set or its journalId equals current
    var suggestedArticle = SuggestedArticles.findOne();
    if (!suggestedArticle)return;
    var article = Articles.findOne({_id: suggestedArticle.articleId});
    if (!article) return;
    if (!currentJournalId) return article;
    if (article.journalId !== currentJournalId) return;
    return article;
}
createMostReadList = function (journalId, limit) {
    var allIds = [];
    //get the most read object by grouping articleviews
    var most = getMostReadByJournal(journalId, limit);
    if (!most)return [];
    //get the suggestion
    var suggestion = getMostReadSuggestion(journalId);
    //add suggestion to top of list
    if (suggestion) {
        allIds.push(suggestion._id);
    }
    _.each(most, function (item) {
        allIds.push(item._id.articleId);
    });
    return _.uniq(allIds); //This removes any duplicates after initial
}
Meteor.methods({
    'distinctVolume': function (journalId) {
        var result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
    'grabSessions': function (id) {
        var c = UserStatus.connections.findOne({userId: id});
        if (c && c.ipAddr)
            return c.ipAddr;
        return "";
    },
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
        return createMostReadList(journalId, limit);
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
        PageViews.aggregate([{
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
