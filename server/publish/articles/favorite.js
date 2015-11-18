Meteor.publish('myFavouriteArticles', function (userId) {
    var thisUser = Users.findOne({_id: userId});
    if (!thisUser)return;
    if (!thisUser.favorite)return;
    var result = _.pluck(thisUser.favorite, "articleId")
    return [
        Articles.find({_id: {$in: result}}, {
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