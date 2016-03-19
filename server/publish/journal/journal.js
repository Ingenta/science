Meteor.publish('oneJournalArticles', function (id,issueId) {
    if(!id)return this.ready();
    if(!issueId)return this.ready();
    return Articles.find({journalId: id, issueId: issueId}, {
        fields: {sections: 0, figures: 0, references: 0}
    });
});

Meteor.publish('oneIssueArticlesByArticleId', function (id) {
    if(!id)return this.ready();
    var art = Articles.findOne({_id: id});
    if(!art)return this.ready();
    return Articles.find({issueId: art.issueId}, {
        fields: {doi: 1, elocationId: 1, issueId: 1}
    });
});

Meteor.publish('journalBrowseTab', function (journalShortTitle,issue) {
    if(!journalShortTitle)return this.ready();
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    if(!issue)return this.ready();

    //combine all historical journals
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});

    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    return [
        Articles.find({journalId: journalId, issue: issue}, {
            fields: {sections: 0, figures: 0, references: 0, authorNotes:0, affiliations:0, tables:0, pacs:0, fundings:0}
        }),
        Volumes.find({journalId:{$in:idArr}}),
        Issues.find({journalId:{$in:idArr}})
      ]
});
Meteor.publish('journalBrowseTabVolumeList', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
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
        Issues.find({journalId:{$in:idArr}})
    ]
});
Meteor.publish('journalBrowseTabArticleList', function (journalShortTitle, issueId) {
    if(!journalShortTitle)return this.ready();
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    if(!issueId)return this.ready();
    return [
        Articles.find({journalId: journalId, issueId: issueId}, {
            fields: {sections: 0, figures: 0, references: 0, authorNotes:0, affiliations:0, tables:0, pacs:0, fundings:0}
        })
    ]
});



Meteor.publish('journalOverviewTab', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    var recommended = EditorsRecommend.find({publications: journalId}, {fields: {ArticlesId: 1}}, {limit: 5}).fetch();
    var recommendedArticleIds = _.pluck(recommended, "ArticlesId");
    var mostRead = createMostReadList(journalId, 5);
    var mostCitedList = MostCited.find({journalId:journalId},{limit:5,sort: {count: -1}});
    var mostCited = _.pluck(mostCitedList.fetch(), 'articleId');
    var homepageArticles = _.union(recommendedArticleIds,mostRead,mostCited);
    return [
        Articles.find({_id: {$in: homepageArticles}}, {
            fields: articleWithMetadata
        }),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        }),
        SuggestedArticles.find(),
        EditorsRecommend.find({publications: journalId})
    ]

});


Meteor.publish('journalOnlineFirstTab',function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return Articles.find({journalId:journalId,pubStatus:"online_first"});
})
Meteor.publish('journalAcceptedTab',function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    return Articles.find({journalId:journalId,pubStatus:"accepted"});
})

