Meteor.methods({
    'distinctVolume': function (journalId) {
        result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
//        var geo = ScienceXML.getFileContentsFromFullPath("http://freegeoip.net/json/"+"175.144.126.252");
//        console.log(geo);
        return c.ipAddr;
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

