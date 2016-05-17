var Future = Npm.require('fibers/future');

Meteor.methods({
    'getArticlePageViewsPieChartData': function (articleId) {
        check(articleId, String);
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
    'getArticlePageLocationReport': function (action, articleId) {
        check(action, String);
        check(articleId, String);
        var myFuture = new Future();

        PageViews.rawCollection().group(
            {ip: true},
            {articleId: articleId, action: action},
            {count: 0},
            function (doc, result) {
                result.count++;
            },
            Meteor.bindEnvironment(function (err, result) {
                var countryViews = {};
                var other = {name: {cn: '其他', en: 'Others'}, locationCount: 0};
                var china = {name: {cn: "中国", en: "China"}, locationCount: 0};
                _.each(result, function (item) {
                    if (item.ip.startWith("192.168.")) {
                        china.locationCount += item.count;
                    } else {
                        var currentUserIPNumber = Science.ipToNumber(item.ip);
                        var country = IP2Country.findOne({
                            startIpLong: {$lte: currentUserIPNumber},
                            endIpLong: {$gte: currentUserIPNumber}
                        }, {fields: {country: 1, countryCode2: 1}});
                        if (country) {
                            if (_.contains(Config.chinaCodes,country.countryCode2)) {
                                china.locationCount += item.count;
                            } else if (countryViews[country.countryCode2]) {
                                countryViews[country.countryCode2].locationCount += item.count;
                            } else {
                                countryViews[country.countryCode2] = {name: country.country, locationCount: item.count}
                            }
                        } else {
                            other.locationCount += item.count;
                        }
                    }
                })
                countryViews = _.values(countryViews);
                if (other.locationCount > 0)
                    countryViews.push(other);
                if (china.locationCount > 0) {
                    countryViews.unshift(china);
                }
                return myFuture.return(countryViews);
            })
        )
        return myFuture.wait()
    },
    'getArticlePageViewsGraphData': function (articleId) {
        check(articleId, String);
        var myFuture2 = new Future();
        var currentDate = new Date;
        var startDate = new Date().addMonths(-11);
        var currentDateCode = currentDate.getFullYear() * 100 + currentDate.getMonth()+1;
        var startDateCode = startDate.getFullYear() * 100 + startDate.getMonth()+1;
        PageViews.rawCollection().group(
            {dateCode: true},
            {
                articleId: articleId,
                action: {$in: ["abstract", "fulltext","pdfDownload"]},
                dateCode: {$gte: startDateCode, $lte: currentDateCode}
            },
            {total: 0, abstract: 0, fulltext: 0, pdfDownload:0},
            function (doc, result) {
                result.total++;
                result[doc.action]++;
            },
            Meteor.bindEnvironment(function (err, result) {
                var month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var dcode = startDateCode;
                var finalizeData = {abstract: [], fulltext: [], download:[], months: [], total: []};
                while (dcode <= currentDateCode) {
                    var m = _.find(result, function (item) {
                        return item.dateCode == dcode
                    });
                    finalizeData.abstract.push(m ? m.abstract : 0);
                    finalizeData.fulltext.push(m ? m.fulltext : 0);
                    finalizeData.download.push(m ? m.pdfDownload : 0);
                    finalizeData.total.push(m ? m.total : 0);
                    finalizeData.months.push(Math.round(dcode / 100) + " " + month[dcode % 100]);
                    dcode += (dcode % 100 == 12) ? 89 : 1;
                }
                return myFuture2.return(finalizeData);
            })
        )
        return myFuture2.wait()
    }
});