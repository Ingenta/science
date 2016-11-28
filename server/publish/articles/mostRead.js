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

Meteor.publish('insertMostReadArticles', function () {
    Meteor.call("getMostRead", undefined, 20, function (err, result) {
        if(_.isEmpty(result))return this.ready();
        var mostRead = MostCount.findOne({type:"homeMostRead"},{sort:{createDate:-1}});
        if(mostRead===undefined || _.difference(mostRead.ArticlesId,result).length > 0){
            MostCount.insert({ArticlesId:result, type:"homeMostRead", createDate:new Date()});
        }
    });
    var journal = Publications.find({},{fields:{shortTitle:1}});
    if(journal){
        journal.forEach(function(journal){
            Meteor.call("getMostRead", journal._id, 20, function (err, result) {
                if(_.isEmpty(result))return this.ready();
                var mostRead = MostCount.findOne({type:"journalMostRead",journalId:journal._id},{sort:{createDate:-1}});
                if(mostRead===undefined || _.difference(mostRead.ArticlesId,result).length > 0){
                    MostCount.insert({ArticlesId:result, journalId:journal._id, type:"journalMostRead", createDate:new Date()});
                }
            });
        });
    }
    return this.ready();
});