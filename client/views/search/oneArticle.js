Template.oneArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        return this.surname + ' ' + this.given;
    },
    query:function(){
        return Router.current().params.searchQuery;
    }
});
