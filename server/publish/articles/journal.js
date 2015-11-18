Meteor.publish('oneJournalArticles', function (id) {
    return Articles.find({journalId: id}, {
        sort: {elocationId: 1},
        fields: {sections: 0, figures: 0, references: 0}
    });
});

Meteor.publish('oneIssueArticlesByArticleId', function (id) {
    var art = Articles.findOne({_id: id});
    if(!art)return;
    return Articles.find({issueId: art.issueId}, {
        fields: {doi: 1, elocationId: 1}
    });
});
