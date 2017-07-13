Meteor.publish('images', function () {
    // return Images.find({},{fields:{uploadedAt:0,original:0,owner:0,"copies.images.createdAt":0,"copies.images.updatedAt":0,"copies.images.key":0}});
    return Images.find({},{fields:{"copies.images.key":1}});
});

Meteor.publish('homeNewsImage', function () {
    var news = News.find({publications: {$exists: false}},{limit:3}).fetch();
    if (!news)return this.ready();
    var newsImage =[];
    _.each(news,function(item){
        if(item.picture){
            newsImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsImage}});
});

Meteor.publish('journalNewsImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var news = News.find({publications: journal._id,types:"2"}).fetch();
    var newsImage =[];
    _.each(news,function(item){
        if(item.picture){
            newsImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsImage}});
});

Meteor.publish('homePromoteImage', function () {
    var ad = Advertisement.find({types:"1"}).fetch();
    if (!ad)return this.ready();
    var adsImage =[];
    _.each(ad,function(item){
        if(item.pictures){
            adsImage.push(item.pictures);
        }
        if(item.defaultPictures){
            adsImage.push(item.defaultPictures);
        }
    });
    return Images.find({_id: {$in: adsImage}});
});

Meteor.publish('journalPromoteImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var ad = Advertisement.find({types:"2",publications:journal._id}).fetch();
    var adsImage =[];
    _.each(ad,function(item){
        if(item.pictures){
            adsImage.push(item.pictures);
        }
        if(item.defaultPictures){
            adsImage.push(item.defaultPictures);
        }
    });
    return Images.find({_id: {$in: adsImage}});
});

Meteor.publish('publisherImage', function () {
    var publisher = Publishers.find().fetch();
    if (!publisher)return this.ready();
    var publisherImage =[];
    _.each(publisher,function(item){
        if(item.picture){
            publisherImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: publisherImage}});
});

Meteor.publish('oneArticleFigures', function (articleDoi) {
    if(!articleDoi)return this.ready();
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return this.ready();
    var thisArticleImageIds = _.union(_.pluck(a.figures, "imageId"),_.pluck(a.authorFigures, "imageId"));
    return FiguresStore.find({_id: {$in: thisArticleImageIds}}, {sort: {'uploadedAt': -1}});
});

Meteor.publish('newsJournalImages', function () {
    var journal = Publications.find().fetch();
    if (!journal)return this.ready();
    var journalImage =[];
    _.each(journal,function(item){
        if(item.picture){
            journalImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: journalImage}});
});

Meteor.publish('journalImages', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalImage =[];
    if(journal.picture){
        journalImage.push(journal.picture);
    }
    if(journal.defaultCover){
        journalImage.push(journal.defaultCover);
    }
    if(journal.banner){
        journalImage.push(journal.banner);
    }
    if(journal.authorPicture){
        journalImage.push(journal.authorPicture);
    }
    return Images.find({_id: {$in: journalImage}});
});

Meteor.publish('journalBannerImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    return Images.find({_id: journal.banner});
});

Meteor.publish('journalRecommendImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalRec = EditorsRecommend.find({publications: journal._id},{sort: {createDate: -1}, limit: 5}).fetch();
    var journalRecImage =[];
    _.each(journalRec,function(item){
        if(item.behalfPicture){
            journalRecImage.push(item.behalfPicture);
        }
    });
    return Images.find({_id: {$in: journalRecImage}});
});

Meteor.publish('journalEditorBoardImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalEdB = EditorialBoard.find({publications:journal._id}).fetch();
    var journalEdBImage =[];
    _.each(journalEdB,function(item){
        if(item.picture){
            journalEdBImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: journalEdBImage}});
});

Meteor.publish('journalAboutImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var about = EditorialMember.find({publications: journal._id}).fetch();
    var aboutImage =[];
    _.each(about,function(item){
        if(item.picture){
            aboutImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: aboutImage}});
});

Meteor.publish('journalIssuesImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var issues = Issues.find({journalId:journal._id}).fetch();
    var issuesImage =[];
    _.each(issues,function(item){
        if(item.picture){
            issuesImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: issuesImage}});
});

Meteor.publish('IssuesOnlyImage', function (journalShortTitle,volume,issue) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var issues = Issues.find({journalId:journal._id,volume:volume,issue:issue}).fetch();
    var issuesImage =[];
    _.each(issues,function(item){
        if(item.picture){
            issuesImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: issuesImage}});
});

Meteor.publish('collectionsImage', function () {
    var collections = ArticleCollections.find().fetch();
    if (!collections)return this.ready();
    var collectionImage =[];
    _.each(collections,function(item){
        if(item.picture){
            collectionImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: collectionImage}});
});

Meteor.publish('publisherCollectionsImage', function (publisherShortName) {
    if(!publisherShortName)return this.ready();
    check(publisherShortName, String);
    var publisher = Publishers.findOne({shortname: publisherShortName});
    if(!publisher)return this.ready();
    var collections = ArticleCollections.find({publisherId:publisher._id}).fetch();
    if (!collections)return this.ready();
    var collectionImage =[];
    _.each(collections,function(item){
        if(item.picture){
            collectionImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: collectionImage}});
});

Meteor.publish('journalCollectionsImage', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var collections = ArticleCollections.find({journalId:journal._id}).fetch();
    if (!collections)return this.ready();
    var collectionImage =[];
    _.each(collections,function(item){
        if(item.picture){
            collectionImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: collectionImage}});
});

Meteor.publish('columnImage', function () {
    var column = Column.find().fetch();
    if (!column)return this.ready();
    var columnImage =[];
    _.each(column,function(item){
        if(item.picture){
            columnImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: columnImage}});
});

Meteor.publish('newsCenterRecImage', function () {
    var newsCenter = NewsCenter.find({recommend:"2"},{sort: {releaseTime: -1}, limit: 3}).fetch();
    if (!newsCenter)return this.ready();
    var newsCenterImage =[];
    _.each(newsCenter,function(item){
        if(item.picture){
            newsCenterImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsCenterImage}});
});

Meteor.publish('newsCenterRecMaImage', function () {
    var newsCenter = NewsCenter.find({recommend:"1",types:"2"},{sort: {releaseTime: -1}, limit: 5}).fetch();
    if (!newsCenter)return this.ready();
    var newsCenterImage =[];
    _.each(newsCenter,function(item){
        if(item.picture){
            newsCenterImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsCenterImage}});
});

Meteor.publish('newsCenterRecPubImage', function () {
    var newsCenter = NewsCenter.find({recommend:"1",types:"3"},{sort: {releaseTime: -1}, limit: 5}).fetch();
    if (!newsCenter)return this.ready();
    var newsCenterImage =[];
    _.each(newsCenter,function(item){
        if(item.picture){
            newsCenterImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsCenterImage}});
});

Meteor.publish('newsRecommendImage', function () {
    var newsRec = NewsRecommend.find({},{sort: {createDate: -1}, limit: 7}).fetch();
    if (!newsRec)return this.ready();
    var newsRecImage =[];
    _.each(newsRec,function(item){
        if(item.picture){
            newsRecImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsRecImage}});
});

Meteor.publish('newsLinkImage', function () {
    var newsLink = NewsLink.find({types:"3"}).fetch();
    if (!newsLink)return this.ready();
    var newsLinkImage =[];
    _.each(newsLink,function(item){
        if(item.picture){
            newsLinkImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsLinkImage}});
});

Meteor.publish('newsBottomLinkImage', function () {
    var newsLink = NewsLink.find({types:"1"}).fetch();
    if (!newsLink)return this.ready();
    var newsLinkImage =[];
    _.each(newsLink,function(item){
        if(item.picture){
            newsLinkImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsLinkImage}});
});

Meteor.publish('cooperationImage', function () {
    var newsLink = NewsLink.find({types:"2"}).fetch();
    if (!newsLink)return this.ready();
    var newsLinkImage =[];
    _.each(newsLink,function(item){
        if(item.picture){
            newsLinkImage.push(item.picture);
        }
    });
    return Images.find({_id: {$in: newsLinkImage}});
});

Meteor.publish('institutionsImage', function () {
    var institutions = Institutions.find().fetch();
    if (!institutions)return this.ready();
    var institutionsImage =[];
    _.each(institutions,function(item){
        if(item.logo){
            institutionsImage.push(item.logo);
        }
    });
    return Images.find({_id: {$in: institutionsImage}});
});