Template.MetricsTemplate.helpers({
    number: function () {
       return CountArticle.find().count();
    }
});