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
