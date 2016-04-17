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
        console.time('aaab')

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
                _.each(result, function (item) {
                    var currentUserIPNumber = Science.ipToNumber(item.ip);
                    var country = IP2Country.findOne({
                        startIpLong: {$lte: currentUserIPNumber},
                        endIpLong: {$gte: currentUserIPNumber}
                    }, {fields: {country: 1, countryCode2: 1}});
                    if (country) {
                        if (countryViews[country.countryCode2]) {
                            countryViews[country.countryCode2].locationCount += item.count;
                        } else {
                            countryViews[country.countryCode2] = {name: country.country, locationCount: item.count}
                        }
                    } else {
                        other.locationCount += item.count;
                    }
                })
                countryViews = _.values(countryViews);
                if (other.locationCount > 0)
                    countryViews.push(other);
                return myFuture.return(countryViews);
            })
        )
        return myFuture.wait()
    },
    'getArticlePageViewsGraphData': function (articleId) {
        check(articleId, String);
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

        _.each(a, function (el, index) {
            var value = el + f[index];
            c.push(value);
        });
        var result = {abstract: a, fulltext: f, total: c, months: m};
        return result;
    }
});