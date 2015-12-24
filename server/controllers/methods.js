Meteor.methods({
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
        return createMostReadList(journalId, limit);
    },
    'totalConnections': function () {
        return UserStatus.connections.find({userAgent:{$exists:true}}).count();
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
        return getArticlePageViewsGraphData(articleId);
    },
    'getLocationReport': function (action, articleId) {
        return getArticlePageLocationReport(action,articleId);
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
    },
    getDefaultPublisherId: function () {
        var defaultPublisher = Publishers.findOne({shortname: Config.defaultPublisherShortName});
        if(defaultPublisher) return defaultPublisher._id;
    },
    updateMostCited:function(){
        updateMostCited && updateMostCited();
        return true;
    }
});

