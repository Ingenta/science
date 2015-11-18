Meteor.publish('myFavouriteArticles', function (userId) {
    var thisUser = Users.findOne({_id: userId});
    if (!thisUser)return;
    if (!thisUser.favorite)return;
    var favorites = _.pluck(thisUser.favorite, "articleId")
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
    var thisUser = Users.findOne({_id: userId});
    if (!thisUser)return;
    if (!thisUser.profile)return;
    if (!thisUser.profile.interestedOfArticles)return;
    var watched = thisUser.profile.interestedOfArticles;
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