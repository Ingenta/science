//TODO this is inefficient and fetches too many documents, consider dynamic loading or meteor.call
Meteor.publish('journalBrowseTabVolumeList', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;

    //combine all historical journals
    var idArr = [journalId];
    var journal = Publications.findOne({_id: journalId}, {fields: {historicalJournals: 1}});

    if (journal && !_.isEmpty(journal.historicalJournals)) {
        idArr = _.union(idArr, journal.historicalJournals)
    }
    return [
        Volumes.find({journalId: {$in: idArr}}),
        Issues.find({journalId: {$in: idArr}}, {fields: {updateDate:0,createDate: 0}, sort: {order: -1},limit:300})
    ]
});

Meteor.publish('journalBrowseTabIssuesList', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;

    //combine all historical journals
    var idArr = [journalId];
    var journal = Publications.findOne({_id: journalId}, {fields: {historicalJournals: 1}});

    if (journal && !_.isEmpty(journal.historicalJournals)) {
        idArr = _.union(idArr, journal.historicalJournals)
    }
    return [
        Issues.find({journalId: {$in: idArr}}, {fields: {updateDate:0,createDate: 0}, sort: {order: -1},skip:300})
    ]
});

Meteor.publish('journalBrowseTabArticleList', function (issueId) {
    if (!issueId)return this.ready();
    check(issueId, String);

    //get all topic id
    var topics = Articles.find({issueId: issueId}, {fields: {topic: 1}}).fetch();
    var topicsArr = _.reduce(topics, function (memo, item) {
        if (item.topic) {
            return _.union(memo, item.topic);
        }
        return memo;
    }, []);
    topicsArr = _.compact(topicsArr);

    var publishList = [
        Articles.find({issueId: issueId}, {
            fields: articleWithMetadata
        })
    ];

    if (!_.isEmpty(topicsArr)) {
        publishList.push(Topics.find({_id: {$in: topicsArr}}))
    }
    return publishList;

});

Meteor.publish('journalMoopTabArticleList', function (journalId) {
    if (!journalId)return this.ready();
    check(journalId, String);

    var moopdois = Collections.Medias.find({journalId:journalId,doi:{$exists:1}},{fields:{doi:1}}).fetch();
    if(_.isEmpty(moopdois))
        return this.ready();

    moopdois= _.pluck(moopdois,"doi");
    //get all topic id
    var topics = Articles.find({doi:{$in:moopdois}}, {fields: {topic: 1}}).fetch();
    var topicsArr = _.reduce(topics, function (memo, item) {
        if (item.topic) {
            return _.union(memo, item.topic);
        }
        return memo;
    }, []);
    topicsArr = _.compact(topicsArr);

    var publishList = [
        Articles.find({doi:{$in:moopdois}}, {
            fields: articleWithMetadata
        })
    ];

    if (!_.isEmpty(topicsArr)) {
        publishList.push(Topics.find({_id: {$in: topicsArr}}))
    }
    return publishList;

});

Meteor.publish('journalOverviewTab', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    var recommended = EditorsRecommend.find({publications: journalId}, {sort: {createDate: -1}, limit: 5});
    var recommendedArticleIds = _.pluck(recommended.fetch(), "ArticlesId");
    var mostRead = MostCount.find({type:"journalMostRead", journalId:journalId},{sort:{createDate:-1}, limit: 1});
    var mostReadArticle = mostRead && _.pluck(mostRead.fetch(), "ArticlesId");
    var mostCitedList = MostCited.find({journalId: journalId}, {limit: 5, sort: {count: -1}});
    var mostCited = _.pluck(mostCitedList.fetch(), 'articleId');
    var recentlyUploadedList = Articles.find({journalId: journalId}, {
        sort: {createdAt: -1},
        limit: 10,
        fields: {_id: 1}
    })
    var recentlyUploaded = _.pluck(recentlyUploadedList.fetch(), '_id');
    var homepageArticles = _.union(recommendedArticleIds, mostReadArticle[0], mostCited, recentlyUploaded);

    return [
        Articles.find({_id: {$in: homepageArticles}}, {
            fields: {
                title: 1,
                journalId: 1,
                doi: 1,
                contentType: 1,
                createdAt:1
            }
        }),
        recommended,
        mostRead,
        mostCitedList
    ]
});

Meteor.publish('publishersJournalsTab', function (journalId) {
    if (!journalId)return this.ready();
    return Articles.find({journalId: journalId});
})
Meteor.publish('journalOnlineFirstTab', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return Articles.find({journalId: journalId, pubStatus: "online_first"});
})
Meteor.publish('journalAcceptedTab', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return Articles.find({journalId: journalId, pubStatus: "accepted"});
})
Meteor.publish('journalEditorialBoard', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return [
        EditorialBoard.find({publications: journalId}),
        About.find({publications: journalId})
    ]
})
Meteor.publish('journalAuthorCenterTab', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return AuthorCenter.find({publications: journalId});
})
Meteor.publish('journalMoopTab', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return Collections.Medias.find({journalId: journalId});
})
