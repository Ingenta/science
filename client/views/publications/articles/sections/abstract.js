Template.AbstractTemplate.helpers({
    articleNumber: function (id) {
        CountArticle.insert({
            articleId: id,
            userId: Meteor.userId()
        });
    }
});