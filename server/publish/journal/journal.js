
Meteor.publish('getAllIssuesMatchingThisOneForNextAndPrevious', function (doi) {
    if(!doi)return this.ready();
    check(doi, String);
    var art = Articles.findOne({doi: doi},{fields:{issueId:1}});
    if(!art)return this.ready();
    return Articles.find({issueId: art.issueId}, {
        fields: {doi: 1, elocationId: 1, issueId: 1}
    });
});

Meteor.publish('journalBrowseTab', function (journalShortTitle,issue) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    if(!issue)return this.ready();
    check(issue, String);

    //combine all historical journals
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});

    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }

    //get all topic id
    var topics = Articles.find({journalId: journalId, issue: issue},{fields:{topic:1}}).fetch();
    var topicsArr = _.reduce(topics,function(memo,item){
        if(item.topic){
            return _.union(memo,item.topic);
        }
        return memo;
    },[]);
    topicsArr = _.compact(topicsArr);

    var publishList = [
        Articles.find({journalId: journalId, issue: issue}, {
            fields: {sections: 0, figures: 0, references: 0, authorNotes:0, affiliations:0, tables:0, pacs:0, fundings:0}
        })
    ];
    if(!_.isEmpty(idArr)){
        publishList.push(Volumes.find({journalId:{$in:idArr}}));
        publishList.push(Issues.find({journalId:{$in:idArr}},{fields:{createDate:0}}))
    }
    if(!_.isEmpty(topicsArr)){
        publishList.push(Topics.find({_id:{$in:topicsArr}}))
    }
    return publishList;
});
Meteor.publish('journalBrowseTabVolumeList', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;

    //combine all historical journals
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});

    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    return [
        Volumes.find({journalId:{$in:idArr}}),
        Issues.find({journalId:{$in:idArr}},{fields:{createDate:0}})
    ]
});
Meteor.publish('journalBrowseTabArticleList', function (journalShortTitle, issueId) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    if(!issueId)return this.ready();
    check(issueId, String);

    //get all topic id
    var topics = Articles.find({journalId: journalId, issueId: issueId},{fields:{topic:1}}).fetch();
    var topicsArr = _.reduce(topics,function(memo,item){
        if(item.topic){
            return _.union(memo,item.topic);
        }
        return memo;
    },[]);
    topicsArr = _.compact(topicsArr);

    var publishList = [
        Articles.find({journalId: journalId, issueId: issueId}, {
            fields: {sections: 0, figures: 0, references: 0, authorNotes:0, affiliations:0, tables:0, pacs:0, fundings:0}
        })
    ];

    if(!_.isEmpty(topicsArr)){
        publishList.push(Topics.find({_id:{$in:topicsArr}}))
    }
    return publishList;

});



Meteor.publish('journalOverviewTab', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    var recommended = EditorsRecommend.find({publications: journalId}, {fields: {ArticlesId: 1, publications: 1, createDate: 1}}, {limit: 5});
    var recommendedArticleIds = _.pluck(recommended.fetch(), "ArticlesId");
    var mostRead = createMostReadList(journalId, 5);
    var mostCitedList = MostCited.find({journalId:journalId},{limit:6,sort: {count: -1}});
    var mostCited = _.pluck(mostCitedList.fetch(), 'articleId');
    var recentlyUploadedList = Articles.find({journalId:journalId}, {
        sort: {createdAt: -1},
        limit: 10,
        fields: {_id: 1}
    })
    var recentlyUploaded = _.pluck(recentlyUploadedList.fetch(), '_id');
    var homepageArticles = _.union(recommendedArticleIds,mostRead,mostCited,recentlyUploaded);

    return [
        Articles.find({_id: {$in: homepageArticles}}, {
            fields: {
                title: 1,
                journalId: 1,
                doi: 1
            }
        }),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        }),
        SuggestedArticles.find(),
        recommended,
        mostCitedList
    ]

});

Meteor.publish('publishersJournalsTab',function (journalId) {
    if(!journalId)return this.ready();
    return Articles.find({journalId:journalId});
})
Meteor.publish('journalOnlineFirstTab',function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return Articles.find({journalId:journalId,pubStatus:"online_first"});
})
Meteor.publish('journalAcceptedTab',function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return Articles.find({journalId:journalId,pubStatus:"accepted"});
})
Meteor.publish('journalEditorialBoard',function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return [
        EditorialBoard.find({publications:journalId}),
        About.find({publications:journalId})
    ]
})
Meteor.publish('journalAuthorCenterTab',function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return AuthorCenter.find({publications:journalId});
})
Meteor.publish('journalMoopTab',function(journalShortTitle){
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return Collections.Medias.find({journalId:journalId});
})
