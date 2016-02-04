getMostReadByJournal = function (journalId, limit) {
    if (!limit)limit = 20;//TODO: fix this so it filters out null article ids in the aggregate query
    var mostRead;
    if (journalId) {
        mostRead = MostRead.find({journalId: journalId}, {sort: {count: -1}, limit: limit}).fetch();
    }
    else {
        mostRead = MostRead.find({journalId: {$exists: true}}, {sort: {count: -1}, limit: limit}).fetch();
    }
    if (!mostRead)return;
    return _.filter(mostRead, function (notNull) {
        return notNull._id;
    });
};
getMostReadSuggestion = function (currentJournalId) {
    //add suggestion if journalId not set or its journalId equals current
    var suggestedArticle = SuggestedArticles.findOne();
    if (!suggestedArticle)return;
    var article = Articles.findOne({_id: suggestedArticle.articleId});
    if (!article) return;
    if (!currentJournalId) return article;
    if (article.journalId !== currentJournalId) return;
    return article;
};

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
};

updateMostCited = function(){
    MostCited.remove({});
    Publications.find().forEach(function (journal) {
        var citations = Articles.find(
            {citations: {$exists: true}, journalId: journal._id}, {sort: {'citationCount': -1}, limit: 20, fields: {_id:1, title:1, citationCount:1, journalId: 1}}
        ).fetch();
        if(!_.isEmpty(citations)){
            citations.forEach(function (item) {
                MostCited.insert({
                    articleId: item._id,
                    title: item.title,
                    count: item.citationCount,
                    journalId: item.journalId
                });
            });
        }
    });
};

updateMostRead = function(){
    MostRead.remove({});
    Publications.find({visible: "1"}).forEach(function (journal) {
        PageViews.aggregate([{
            $match: {
                journalId: journal._id,
                articleId: {$ne: null}
            }
        }, {
            $group: {
                _id: '$articleId',
                count: {$sum: 1}

            }
        }, {$sort: {count: -1}}
            , {$limit: 20}]).forEach(function (obj) {
            obj.journalId = journal._id;
            MostRead.insert(obj);
        });
    });
    PageViews.aggregate([{
        $match: {
                    articleId: {$ne: null}
                }
            }, {
        $group: {
            _id: '$articleId',
            count: {$sum: 1}
        }
    }, {$sort: {count: -1}}
        , {$limit: 20}]).forEach(function (obj) {
        MostRead.insert(obj);
    });
};