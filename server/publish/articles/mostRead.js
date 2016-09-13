Meteor.publish('homepageMostRead', function (journalId) {
    var result = createMostReadList(journalId,20);
    if(_.isEmpty(result))return this.ready();
    return [
        Articles.find({_id: {$in: result}}, {
            fields: articleWithMetadata
        }),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        }),
        SuggestedArticles.find()
    ]

});

Meteor.publish('journalMostReadBrief', function (journalShortTitle) {
    if(journalShortTitle){
        check(journalShortTitle, String);
        var journal = Publications.findOne({shortTitle: journalShortTitle});
        if(!journal)return this.ready();
        var journalId=journal._id;
        var result = createMostReadList(journalId, 5);
    }else{
        var result = createMostReadList(undefined,5);
    }
    if(_.isEmpty(result))return this.ready();
    return [
        Articles.find({_id: {$in: result}}, {
            fields: {doi: 1, title: 1}
        }),
        SuggestedArticles.find()
    ]

});