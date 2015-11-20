Meteor.publish('myFavouriteArticles', function (userId) {
    var favorites = [];
    var thisUser = Users.findOne({_id: userId});
    if (thisUser)
        if (thisUser.favorite)
            favorites = _.pluck(thisUser.favorite, "articleId")
    return [
        Articles.find({_id: {$in: favorites}}, {
            fields: articleWithMetadata
        }),
        Publishers.find({}, {
            fields: {name: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        })
    ]

});

Meteor.publish('myWatchedArticles', function (userId) {
    var watched = [];
    var thisUser = Users.findOne({_id: userId});
    if (thisUser)
        if (thisUser.profile)
            if (thisUser.profile.articlesOfInterest)
                watched = thisUser.profile.articlesOfInterest;
    return [
        Articles.find({_id: {$in: watched}}, {
            fields: articleWithMetadata
        }),
        Publishers.find({}, {
            fields: {name: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1}
        })
    ]

});