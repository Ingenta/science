Template.authorPopButton.events({
    'click a.author-name': function (event) {
        event.preventDefault();
        var ele = $(event.currentTarget);
        var name = TAPi18n.getLanguage() === "zh-CN" ? this.fullname.cn : this.fullname.en;
        var clearname=Science.clearTags(name);
        var title = Blaze.toHTMLWithData(Template.authorPopTitle,{
            name:name
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
        return TAPi18n.getLanguage() === "zh-CN" ? this.fullname.cn : this.fullname.en;
    },
    refs: function(){
        var allrefs=[];
        if(!_.isEmpty(this.affs)){
            var affsArr = _.each(this.affs,function(aff){
                var match = /\d/.exec(aff);
                if(!_.isEmpty(match)){
                    allrefs.push(match[0]);
                }
            })
            if(!_.isEmpty(allrefs)){
                allrefs=_.sortBy(allrefs,function(i){return i});
            }
        }
        if(this.corresp){
            allrefs.push("*");
        }
        if(!_.isEmpty(allrefs)){
            return allrefs;
        }
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