Meteor.methods({
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
        if(journalId)
            check(journalId, String);
        if(limit)
            check(limit, Number);
        return createMostReadList(journalId, limit);
    },
    'totalConnections': function () {
        return UserStatus.connections.find({userAgent: {$exists: true}}).count();
    },
    'totalArticles': function () {
        return Articles.find().count();
    },
    'getLocationByCurrentIP': function () {
        var ip = this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
        return getLocationByIP(ip);
    },
    'updateKeywordScore': function (keywords, score) {
        //TODO: add a check for type here but input could be object so need to be careful
        check(score, Number);
        if (_.isEmpty(keywords))
            return;
        var arr = (typeof keywords === 'string') ? [keywords] : keywords;
        var sc = score || 1;
        Meteor.defer(function () {
            Keywords.update({name: {$in: arr}}, {$inc: {"score": sc}}, {multi: true});
        });
        return true;
    },
    'insertAudit': function (userId, action, publisherId, journalId, articleId, keywords) {
        if(userId)check(userId, String);
        check(action, String);
        if(publisherId)check(publisherId, String);
        if(journalId)check(journalId, String);
        if(articleId)check(articleId, String);
        if(keywords)check(keywords, String);
        var datetime = new Date();
        var dateCode = datetime.getUTCFullYear() * 100 + (datetime.getUTCMonth() + 1);
        var user = Users.findOne({_id: userId}, {fields: {institutionId: 1}});
        var ip;
        var ipAddrStr = this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
        var matchedIpArr = ipAddrStr.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/g);
        if(_.isArray(matchedIpArr) && !_.isEmpty(matchedIpArr)){
            ip= _.last(matchedIpArr);
        }
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
            ip: ip,
            origIp: ipAddrStr
        });
    },
    getDefaultPublisherId: function () {
        var defaultPublisher = Publishers.findOne({shortname: Config.defaultPublisherShortName});
        if (defaultPublisher) return defaultPublisher._id;
    },
    updateMostCited: function () {
        updateMostCited && updateMostCited();
        return true;
    },
    getMoopForArticle: function (doi) {
        if (!doi) return;
        check(doi, String);
        var medias = Collections.Medias.find({doi: doi});
        if (medias.count()) {
            var datas = _.map(medias.fetch(), function (item) {
                var obj = {};
                obj.title = item.title;
                obj.description = item.description;
                if (item.fileId) {
                    var file = Collections.JournalMediaFileStore.findOne({_id: item.fileId});
                    if (file) {
                        obj.url = file.url({auth: false});
                        obj.ext = Science.String.getLastPart(file.original.type, "/");
                    }
                }
                return obj;
            })
            return datas;
        }
    },
    getLatestIssueId: function (journalId) {
        if (!journalId)return;
        check(journalId, String);
        var issues = Issues.find({'journalId': journalId}, {fields: {volume: 1}}).fetch();
        if (!issues.length)return;
        var highestVolume = _.max(issues, function (i) {
            return parseInt(i.volume, 10);
        }).volume;
        var issuesInThisVolume = Issues.find({'journalId': journalId, 'volume': highestVolume}).fetch();
        var latestIssue = _.max(issuesInThisVolume, function (i) {
            return parseInt(i.issue, 10);
        });
        return latestIssue._id;
    },
    previousDoi: function (padPage, issueId) {
        if (!padPage)return;
        if (!issueId)return;
        check(padPage, String);
        check(issueId, String);
        return getNextPage(issueId,padPage,false);
    },
    nextDoi: function (padPage, issueId) {
        if (!padPage)return;
        if (!issueId)return;
        if(typeof padPage !== "string") logger.info(padPage);
        if(typeof issueId !== "string") logger.info(issueId);
        check(padPage, String);
        check(issueId, String);
        return getNextPage(issueId,padPage,true);
    },
    volumesAtJournal: function (journalId) {
        if (!journalId)return;
        check(journalId, String);
        var v = Volumes.find({'journalId': journalId}).fetch();
        return _.sortBy(v, function (oneVolume) {
            return parseInt(oneVolume.volume, 10);
        }).reverse();
    },
    removeArticle:function(doi){
        check(doi,String);
        var article=Articles.findOne({doi:doi});
        if(!Permissions.userCan("delete-article", "resource",Meteor.userId(), {journal:article.journalId})){
            throw new Meteor.Error(401, "permissions denied");
        }
        Collections.Medias.remove({doi:doi});
        SubTasks.remove({doi:doi});
        MostCited.remove({articleId:article._id});
        NewsRecommend.remove({ArticlesId:article._id});
        Citations.remove({articleId:article._id});
        EditorsRecommend.remove({ArticlesId:article._id});
        PageViews.remove({ArticlesId:article._id});
        SpecialTopics.update({articles:article._id},{$pull:{articles:article._id}},{multi: true});
        ArticleCollections.update({articles:article._id},{$pull:{articles:article._id}},{multi: true});
        Users.update({"favorite.articleId":article._id},{$pull:{favorite:{articleId:article._id}}},{multi:true});
        Users.update({"profile.articlesOfInterest":article._id},{$pull:{"profile.articlesOfInterest":article._id}},{multi:true});
        var logs=UploadLog.find({articleId:article._id},{_id:1});
        if(logs.count()){
            var logIdArr= _.pluck(logs.fetch(),'_id')
            UploadTasks.remove({logId:{$in:logIdArr}});
            UploadLog.remove({articleId:article._id})
        }
        Articles.remove({doi:doi});
        return true;
    }
});

var getNextPage = function (issue, padPage, ascending) {
    var query={issueId:issue,padPage:{}};
    var key = ascending?"$gt":"$lt";
    var sort = ascending?1:-1;
    query.padPage[key]=padPage;
    var nextArticle = Articles.findOne(query, {fields: {doi: 1},sort:{padPage:sort}});
    if(!nextArticle || !nextArticle.doi)return;
    var pubDoi = nextArticle.doi.substring(0,nextArticle.doi.indexOf("/")+1);
    var endDoi = nextArticle.doi.substring(nextArticle.doi.indexOf("/")+1);
    var articleDoi = endDoi.replace("/","-slash-");
    var doi = pubDoi+articleDoi;
    return doi.substring(doi.lastIndexOf("/") + 1);
}