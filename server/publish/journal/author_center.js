Meteor.publish('author_center', function() {
    return AuthorCenter.find();
});

Meteor.publish('AuthorCenterPage', function (guideId,journalShortTitle) {
    if (!guideId)return this.ready();
    if (!journalShortTitle)return this.ready();
    check(guideId, String);
    check(journalShortTitle, String);
    var authorPage = AuthorCenter.findOne({_id:guideId});
    if (!authorPage)return this.ready();
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    return AuthorCenter.find({type:authorPage.type, publications:journal._id, url:null});
})