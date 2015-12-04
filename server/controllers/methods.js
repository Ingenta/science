getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;
    var mostRead;
    if (journalId) {
        mostRead = PageViews.aggregate([{
            $match: {
                journalId: journalId
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
    }
    else {
        mostRead = PageViews.aggregate([{
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
    }
    if (!mostRead)return;
    return _.filter(mostRead, function (notNull) {
        return notNull._id;
    });
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
        allIds.push(item._id);
    });
    return _.uniq(allIds); //This removes any duplicates after initial
}
//TODO: move to config
var localDevServer = process.env.DOCKER_URL ? process.env.DOCKER_URL : "http://192.168.1.10"
var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
var port = isDev ? "9090" : "8080";
var geoipHost = isDev ? localDevServer : "http://freegeoip";
var geoipUrl = geoipHost + ":" + port + "/json/";
getLocationFromGeoIPServer = function (ip) {
    var urlToCheck = geoipUrl + ip;
    if (Meteor.isDevelopment) {
        //pretend to be baidu in dev mode because of internal office ip not resolving correctly
        urlToCheck = geoipUrl + "baidu.com";
    }
    try {
        var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
        var result = getLocationSync(urlToCheck);
        if (!result)return;
        return EJSON.parse(result);
    } catch (err) {
        logger.error("connection failed to geoip at: " + geoipUrl);
    }


}
getLocationFromLocalDatabase = function (ip) {
    var currentUserIPNumber = Science.ipToNumber(ip);
    var result = IP2Country.findOne({
        startIpLong: {$lte: currentUserIPNumber},
        endIpLong: {$gte: currentUserIPNumber}
    });
    if (!result)return;
    return {
        ip: ip,
        country_code: result.countryCode2,
        country_name: result.country.en,
        country_chinese_name: result.country.cn,
        region_name: result.province.en,
        region_chinese_name: result.province.cn
    }
}

getLocationByIP = function (ip) {
    var result = getLocationFromGeoIPServer(ip);
    if (!result)
        result = getLocationFromLocalDatabase(ip);
    if (!result)return;
    return result;
}

Meteor.methods({
    'distinctVolume': function (journalId) {
        var result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
        return createMostReadList(journalId, limit);
    },
    'totalConnections': function () {
        return UserStatus.connections.find().count();
    },
    'totalArticles': function () {
        return Articles.find().count();
    },
    'getLocationByCurrentIP': function () {
        var ip = this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
        return getLocationByIP(ip);
    },
    'getArticlePageViewsPieChartData': function (articleId) {
        var data = new Array();
        data.push({
            name: TAPi18n.__('Abstract Views'),
            y: PageViews.find({action: "abstract", articleId: articleId}).count()
        });

        data.push({
            name: TAPi18n.__('Full text Views'),
            y: PageViews.find({action: "fulltext", articleId: articleId}).count()
        });

        data.push({
            name: TAPi18n.__('PDF Downloads'),
            y: PageViews.find({action: "pdfDownload", articleId: articleId}).count()
        });
        return data;
    },
    'getArticlePageViewsGraphData': function (articleId) {
        var currentDate = new Date;
        var a = new Array();
        var f = new Array();
        var c = new Array();
        var m = [];
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (var i = 1; i <= 12; i++) {
            var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            a.unshift(PageViews.find({
                action: "abstract",
                articleId: articleId,
                when: {$gte: startDate, $lt: endDate}
            }).count());
            f.unshift(PageViews.find({
                action: "fulltext",
                articleId: articleId,
                when: {$gte: startDate, $lt: endDate}
            }).count());
            m.unshift(month[currentDate.getMonth() % 12] + currentDate.getFullYear());
            currentDate.setMonth(currentDate.getMonth() - 1);
        }

        _.each(a, function (index, el) {
            var value = el + f[index];
            c.push(value);
        });
        var result = {abstract: a, fulltext: f, total: c, months: m};
        return result;
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
    },
    'insertAudit': function (userId, action, publisherId, journalId, articleId, keywords) {
        var datetime = new Date();
        var dateCode = datetime.getUTCFullYear() * 100 + (datetime.getUTCMonth() + 1);
        var user = Users.findOne({_id: userId});
        PageViews.insert({
            articleId: articleId,
            userId: userId,
            institutionId: user ? user.institutionId : null,
            publisher: publisherId,
            journalId: journalId,
            keywords: keywords,
            when: datetime,
            dateCode: dateCode,
            action: action,
            ip: this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress
        });
    }
});

