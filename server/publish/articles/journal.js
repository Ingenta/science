Meteor.publish('oneJournalArticles', function (id) {
    return Articles.find({journalId: id}, {
        fields: {sections: 0, figures: 0, references: 0}
    });
});
