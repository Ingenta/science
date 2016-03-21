Meteor.methods({
    'getClientIP': function () {
        return this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
    },
    'getMostRead': function (journalId, limit) {
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
        if (defaultPublisher) return defaultPublisher._id;
    },
    updateMostCited: function () {
        updateMostCited && updateMostCited();
        return true;
    },
    getNextArticleDoi: function(doi,volume,issue){
        if(!doi)return;
        var a = Articles.findOne({doi: doi});
        if(!a)return;
        var elocationId = a.elocationId;
        var articlesInThisIssue = Articles.find({journalId:a.journalId,volume:volume,issue:issue},{fields: {elocationId: 1, doi: 1}}).fetch()
        var articlesOrderedByPage = _.sortBy(articlesInThisIssue, function (a) {
            return parseInt(a.elocationId, 10);
        });
        //get all article elocations in this volume and sort
        var pageNumbers = _.pluck(articlesOrderedByPage,"elocationId");
        var positionInList = _.indexOf(pageNumbers, elocationId, true);
        var nextPageIndex = positionInList + 1;
        if (!articlesOrderedByPage[nextPageIndex]) return;
        var nextDoi = articlesOrderedByPage[nextPageIndex].doi;
        return nextDoi.substring(nextDoi.lastIndexOf("/") + 1);
    },
    getPrevArticleDoi: function(doi,volume,issue){
        if(!doi)return;
        var a = Articles.findOne({doi: doi});
        if(!a)return;
        var elocationId = a.elocationId;
        var articlesInThisIssue = Articles.find({journalId:a.journalId,volume:volume,issue:issue},{fields: {elocationId: 1, doi: 1}}).fetch()
        var articlesOrderedByPage = _.sortBy(articlesInThisIssue, function (a) {
            return parseInt(a.elocationId, 10);
        });
        //get all article elocations in this volume and sort
        var pageNumbers = _.pluck(articlesOrderedByPage,"elocationId");
        var positionInList = _.indexOf(pageNumbers, elocationId, true);
        var nextPageIndex = positionInList - 1;
        if (!articlesOrderedByPage[nextPageIndex]) return;
        var nextDoi = articlesOrderedByPage[nextPageIndex].doi;
        return nextDoi.substring(nextDoi.lastIndexOf("/") + 1);
    },
    getLatestIssue: function(journalShortTitle){
        var journal = Publications.findOne({shortTitle: journalShortTitle});
        if(!journal)return;
        var volumes = Volumes.find({journalId:journal._id}).fetch();
        if(!volumes)return;
        var sortedVolumes = _.sortBy(volumes, function (oneVolume) {
            return parseInt(oneVolume.volume, 10);
        }).reverse();
        var latestVolume = sortedVolumes[0];
        var issues = Issues.find({'journalId': journal._id, 'volume': latestVolume.volume}).fetch();
        if(!issues)return;
        var sortedIssues = _.sortBy(issues, function (oneIssue) {
            return parseInt(oneIssue.issue, 10);
        }).reverse();
        return sortedIssues[0];
    },
    getJournalVolumesList:function(journalShortTitle){
        var journal = Publications.findOne({shortTitle: journalShortTitle});
        if(!journal)return;
        var issues = Issues.find({'journalId': journal._id},{fields:{journalId:0,createDate:0}}).fetch();
        if(!issues)return;
        var sortedIssues = _.sortBy(issues, function (oneIssue) {
            return pad("000",oneIssue.volume,true)+pad("000",oneIssue.issue,true);
        }).reverse();
        return sortedIssues;

    }
});
function pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}
