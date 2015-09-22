Template.authorPopButton.events({
    'click a.author-name': function (event) {
        event.preventDefault();
        var ele = $(event.currentTarget);
        var name = Template.currentData().name;
        var clearname=Science.clearTags(name);
        var title = Blaze.toHTMLWithData(Template.authorPopTitle,{
            name:name
        });
        var content = Blaze.toHTMLWithData(Template.authorPopContent, {
            name:clearname
        });
        ele.popover({
            title: title,
            content: content,
        });
        ele.popover('show');
    },
    'hidden.bs.popover a.author-name': function (event) {
        $(event.target).popover('destroy');
    }
});
Template.authorPopButton.helpers({
    name: function () {
        return Template.currentData().name;
    }
})


Template.authorPopContent.helpers({
    searchUrl:function(){
        var authorName = Template.currentData().name && "\""+Template.currentData().name+"\"";
        var option = {
            filterQuery:{
                journalId:this.journalId,
                author:authorName
            }
        };
        return SolrQuery.makeUrl(option);
    }
})