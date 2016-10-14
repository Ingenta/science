Template.mostCitedArticleShortList.helpers({
    mostCitedArticles: function () {
        if (this.journalId) return MostCited.find({journalId: this.journalId}, {sort: {count: -1}, limit: 5});
        return MostCited.find({}, {sort: {count: -1}, limit: 5});
    },
    mostCiteCount: function () {
        if (this.journalId){
            return MostCited.find({journalId: this.journalId}).count() >= 5;
        }else {
            return MostCited.find().count() >= 5;
        }
    },
    isMostCited: function(){
        if (this.journalId){
            return MostCited.find({journalId: this.journalId}).count() > 0;
        }else {
            return MostCited.find().count() > 0;
        }
    }
});
