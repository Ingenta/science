Meteor.publish('myFavouriteArticles', function () {
    var favorites = [];
    if (this.userId) {
        var thisUser = Users.findOne({_id: this.userId});
        if (thisUser)
            if (thisUser.favorite)
                favorites = _.pluck(thisUser.favorite, "articleId")
        return [
            Articles.find({_id: {$in: favorites}}, {
                fields: articleWithMetadata
            }),
            Publishers.find({}, {
                fields: {shortname: 1}
            }),
            Publications.find({}, {
                fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
            })
        ]
    }
    else {
        this.ready();
    }
});

Meteor.publish('myWatchedArticles', function () {
    var watched = [];
    if (this.userId) {
        var thisUser = Users.findOne({_id: this.userId});
        if (thisUser)
            if (thisUser.profile)
                if (thisUser.profile.articlesOfInterest)
                    watched = thisUser.profile.articlesOfInterest;
        return [
            Articles.find({_id: {$in: watched}}, {
                fields: articleWithMetadata
            }),
            Publishers.find({}, {
                fields: {shortname: 1}
            }),
            Publications.find({}, {
                fields: {publisher: 1, shortTitle: 1}
            })
        ]
    }
    else {
        this.ready();
    }
});