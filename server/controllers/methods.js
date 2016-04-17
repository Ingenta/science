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
    previousDoi: function (elocationId, issueId) {
        if (!elocationId)return;
        if (!issueId)return;
        check(elocationId, String);
        check(issueId, String);
        return getNextPage(issueId,elocationId,false);
    },
    nextDoi: function (elocationId, issueId) {
        if (!elocationId)return;
        if (!issueId)return;
        check(elocationId, String);
        check(issueId, String);
        return getNextPage(issueId,elocationId,true);
    },
    volumesAtJournal: function (journalId) {
        if (!journalId)return;
        check(journalId, String);
        var v = Volumes.find({'journalId': journalId}).fetch();
        return _.sortBy(v, function (oneVolume) {
            return parseInt(oneVolume.volume, 10);
        }).reverse();
    }

});

var getNextPage = function (issue, page, ascending) {
    var articlesInThisIssue = Articles.find({issueId: issue}, {fields: {elocationId: 1, doi: 1}}).fetch();
    var articlesOrderedByPage = _.sortBy(articlesInThisIssue, function (a) {
        return parseInt(a.elocationId, 10);
    });
    var dois = _.pluck(articlesOrderedByPage, "elocationId");
    var positionInList = _.indexOf(dois, page, true);
    var nextPageIndex = ascending ? positionInList + 1 : positionInList - 1;
    if (!articlesOrderedByPage[nextPageIndex]) return false;
    var nextDoi = articlesOrderedByPage[nextPageIndex].doi;
    return nextDoi.substring(nextDoi.lastIndexOf("/") + 1);
}