getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;//TODO: fix this so it filters out null article ids in the aggregate query
    var mostRead;
    if (journalId) {
        mostRead = PageViews.aggregate([{
            $match: {
                journalId: journalId,
                action: "fulltext"
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
            $match: {
                action: "fulltext"
            }
        },{
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            , {$limit: limit}]);
    }
    if (!mostRead)return;
    return _.pluck(mostRead, "_id");
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
    return _.first(_.union(allIds,most),5); //This removes any duplicates after initial
}

updateMostCited = function(){
    Publications.find().forEach(function (journal) {
        var citations = Articles.find(
            {citations: {$exists: true}, journalId: journal._id}, {sort: {'citationCount': -1}, limit: 20, fields: {_id:1, title:1, citationCount:1, journalId: 1}}
        ).fetch();
        if(!_.isEmpty(citations)){
            citations.forEach(function (item) {
                if(MostCited.find({articleId:item._id}).count()){
                    MostCited.update({articleId: item._id},{$set:{count: item.citationCount}});
                }else{
                    MostCited.insert({
                        articleId: item._id,
                        title: item.title,
                        count: item.citationCount,
                        journalId: item.journalId
                    })
                }
            });
        }
    });
};