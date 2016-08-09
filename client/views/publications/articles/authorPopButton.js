Template.authorPopButton.events({
    'click a.author-name': function (event) {
        event.preventDefault();
        var ele = $(event.currentTarget);
        var name = this.name || (TAPi18n.getLanguage() === "zh-CN" ? this.fullname.cn : this.fullname.en);
        var clearname=Science.String.forceClear(name);
        var title = Blaze.toHTMLWithData(Template.authorPopTitle,{
            name:clearname
        });
        var content = Blaze.toHTMLWithData(Template.authorPopContent, {
            name:clearname
        });
        ele.popover({
            title: title,
            content: content
        });
        ele.popover('show');
    },
    'hidden.bs.popover a.author-name': function (event) {
        $(event.target).popover('destroy');
    }
});
Template.authorPopButton.helpers({
    name: function () {
        if(Template.currentData().name)
            return Template.currentData().name;
        if(this.fullname)
            return TAPi18n.getLanguage() === "zh-CN" ? this.fullname.cn : this.fullname.en ;
    }
})


Template.authorPopContent.helpers({
    searchUrl:function(){
        var authorName = Template.currentData().name && "\""+Template.currentData().name+"\"";
        var option = {
            filterQuery:{
                journalId:this.journalId,
                author:[authorName]
            }
        };
        return SolrQuery.makeUrl(option);
    }
})