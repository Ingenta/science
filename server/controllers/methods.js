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
        var user = Users.findOne({_id: userId},{fields:{institutionId:1}});
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
    getMoopForArticle:function(doi){
        if(!doi) return;
        var medias = Collections.Medias.find({doi:doi});
        if(medias.count()){
            var datas = _.map(medias.fetch(),function(item){
                var obj={};
                obj.title=item.title;
                obj.description = item.description;
                if(item.fileId){
                    var file = Collections.JournalMediaFileStore.findOne({_id:item.fileId});
                    if(file){
                        obj.url=file.url({auth:false});
                        obj.ext=Science.String.getLastPart(file.original.type,"/");
                    }
                }
                return obj;
            })
            return datas;
        }
    },
    getLatestIssueId:function(journalId){
        if(!journalId)return;
        var issues = Issues.find({'journalId': journalId},{fields:{volume:1}}).fetch();
        if(!issues.length)return;
        var highestVolume = _.max(issues, function (i) {
            return parseInt(i.volume, 10);
        }).volume;
        // var highestVolume = "59";
        // console.log("journalId: " + journalId);
        // console.log("issues: "+issues.length);
        // console.log("latest volume: " + highestVolume);
        var issuesInThisVolume = Issues.find({'journalId': journalId, 'volume': highestVolume}).fetch();
        var latestIssue = _.max(issuesInThisVolume, function (i) {
            return parseInt(i.issue, 10);
        });
        // console.log("latest issue: " + latestIssue.issue);
        return latestIssue._id;
    }
});

