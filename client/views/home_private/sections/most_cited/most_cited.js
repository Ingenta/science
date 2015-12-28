Template.mostCitedArticleList.helpers({
    mostCitedArticles: function () {
        if (this.journalId) return MostCited.find({journalId: this.journalId}, {sort: {count: -1}, limit: 5});
        return MostCited.find({}, {sort: {count: -1}, limit: 5});
    },
    mostCiteCount: function () {
        if (this.journalId){
            if (5 < MostCited.find({journalId: this.journalId}).count()) {
                return true;
            } else {
                return false;
            }
        }else{
            if (5 < MostCited.find().count()) {
                return true;
            } else {
                return false;
            }
        }
    }
});
