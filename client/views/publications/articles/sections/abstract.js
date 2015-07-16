Template.AbstractTemplate.helpers({
    getKeywords:function(){
        var result=[];
        var total=0;
        _.each(this.keywords,function(item){
            var keyword={};
            keyword.word=item;
            keyword.score=Keywords.findOne({name:item}).score;
            total+=keyword.score;
            result.push(keyword);
        });
        _.each(result,function(item){
            item.percent = item.score / total * 100;
        });
        return  _.sortBy(result,function(obj){
            return -obj.score;
        });
    },
    getScoreByKeyword: function (k) {
        return Keywords.findOne({name: k}).score;
    },
    totals: function (a) {
        var s = 0;
        a.forEach(function(k){
            s += Keywords.findOne({name: k}).score;
        })
        return s;
    }
});

//Template.AbstractTemplate.onRendered(function () {
//    var totalScore = 0;
//    alert(this.keywords);
//    this.keywords.forEach(function(k){
//        totalScore += Keywords.findOne({name: k}).score;
//    })
//});




