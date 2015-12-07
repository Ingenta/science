getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;//TODO: fix this so it filters out null article ids in the aggregate query
    var mostRead;
    if (journalId) {
        mostRead = PageViews.aggregate([{
            $match: {
                journalId: journalId
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
    }
    else {
        mostRead = PageViews.aggregate([{
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
    }
    if (!mostRead)return;
    return _.filter(mostRead, function (notNull) {
        return notNull._id;
    });
}
getMostReadSuggestion = function (currentJournalId) {
    //add suggestion if journalId not set or its journalId equals current
    var suggestedArticle = SuggestedArticles.findOne();
    if (!suggestedArticle)return;
    var article = Articles.findOne({_id: suggestedArticle.articleId});
    if (!article) return;
    if (!currentJournalId) return article;
    if (article.journalId !== currentJournalId) return;
    return article;
}
createMostReadList = function (journalId, limit) {
    var allIds = [];
    //get the most read object by grouping articleviews
    var most = getMostReadByJournal(journalId, limit);
    if (!most)return [];
    //get the suggestion
    var suggestion = getMostReadSuggestion(journalId);
    //add suggestion to top of list
    if (suggestion) {
        allIds.push(suggestion._id);
    }
    _.each(most, function (item) {
        allIds.push(item._id);
    });
    return _.uniq(allIds); //This removes any duplicates after initial
}