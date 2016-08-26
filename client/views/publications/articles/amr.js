Template.webOfScienceAMR.helpers({
    getData:function(){
        var article = Router.current().data();
        return article && article.webOfScience;
    }
})