Template.authorPopButton.events({
    'click a.author-name':function(event){
        var ele=$(event.target);
        var name=Template.currentData().name;
        ele.text(name);
        var html="<div class='author-pop'>";
        html+="<div><a href='/author/"+ name +"'>"+TAPi18n.__("Go to author page")+"</a></div>";
        html+="<hr>";
        html+="<div><a target='_blank' href='http://www.ncbi.nlm.nih.gov/pubmed?term="+name+"[Author]'>PubMed</a></div>";
        html+="<hr>";
        html+="<div><a target='_blank' href='http://scholar.google.com/scholar?q=author:"+name+"'>Google Scholar</a></div>";
        html+="</div>";
        ele.popover({
            title:TAPi18n.__("moreContentBy")+"<br><span class='author-pop-name'>"+Template.currentData().name+"</span>",
            content:html
        });
        ele.popover('show');
    },
    'hidden.bs.popover a.author-name':function(event){
        $(event.target).popover('destroy');
    }
});
Template.authorPopButton.helpers({
    name:function(){
        return Template.currentData().name
    }
});