getHomeMostReadArticles = function (journalId,limit) {
    if (!limit)limit = 20;
    var mostRead;
    if (journalId) {
        mostRead = PageViews.aggregate([{
            $match: {
                journalId: journalId,
                action: "fulltext",
                articleId: {$ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            ,{$limit:limit}]);
    }else {
        mostRead= PageViews.aggregate([{
            $match: {
                action: "fulltext",
                articleId: {$ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            ,{$limit:limit}]);
    }
    if (!mostRead)return;
    return _.pluck(mostRead, "_id");
}

getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;
    var mostRead;
    if (journalId) {
        var fulltext = PageViews.aggregate([{
            $match: {
                journalId: journalId,
                action: "fulltext",
                articleId: {$exists:true, $ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            ,{$limit:limit}]);
        var abstract = PageViews.aggregate([{
            $match: {
                journalId: journalId,
                action: "abstract",
                articleId: {$exists:true, $ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            ,{$limit:limit}]);
    }
    else {
        var fulltext = PageViews.aggregate([{
            $match: {
                action: "fulltext",
                articleId: {$exists:true, $ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            ,{$limit:limit}]);
        var abstract = PageViews.aggregate([{
            $match: {
                action: "abstract",
                articleId: {$exists:true, $ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}
            }
        }, {$sort: {count: -1}}
            ,{$limit:limit}]);
    }
    mostRead =_.union(fulltext,abstract);
    if (!mostRead)return;
    var most = [];
    mostRead.forEach(function (item) {
        var article = Articles.findOne({_id: item._id});
        if(article){
            most.push(item);
            if(most.length === limit){
                return;
            }
        }
    });
    most = _.sortBy(most, function(array){0-array.count});
    return _.pluck(most, '_id');
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
    var most;
    //get the most read object by grouping articleviews

    if(limit == 20){
        most = getMostReadByJournal(journalId, limit);
    }else{
        most = getHomeMostReadArticles(journalId,limit);
        if(most.length < 5){
            most = getMostReadByJournal(journalId, limit);
        }
    }
    if (!most)return [];
    if(!journalId){
        //get the suggestion
        var suggestion = getMostReadSuggestion(journalId);
        //add suggestion to top of list
        if (suggestion) {
            allIds.push(suggestion._id);
        }
    }
    return _.first(_.union(allIds,most),limit || 5); //This removes any duplicates after initial
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