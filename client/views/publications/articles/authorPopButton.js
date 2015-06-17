Template.authorPopButton.events({
    'click a.author-name':function(event){
        var ele=$(event.target);
        var name=Template.currentData().name;
        ele.text(name);
        var html="<ul class='list-unstyled author-list-ul'>";
        html+="<li><a href='/author/"+ name +"'>"+TAPi18n.__("inStation")+"</a></li>";
        html+="<hr>";
        html+="<li><a target='_blank' href='http://www.ncbi.nlm.nih.gov/pubmed?term="+name+"[Author]'>PubMed</a></li>";
        html+="<hr>";
        html+="<li><a target='_blank' href='http://scholar.google.com/scholar?q=author:"+name+"'>Google Scholar</a></li>";
        html+="</ul>";
        ele.popover({
            title:TAPi18n.__("moreContentBy")+"<br><span class='pop-author-name'>"+Template.currentData().name+"</span>",
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