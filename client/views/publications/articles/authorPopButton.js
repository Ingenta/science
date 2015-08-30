Template.authorPopButton.events({
    'click a.author-name': function (event) {
        event.preventDefault();
        var ele = $(event.currentTarget);
        var name = Template.currentData().name;
        var clearname=Science.clearTags(name);
        var html = "<div class='author-pop'>";
        html += "<div><a href='/author/" + clearname + "'>" + TAPi18n.__("Go to author page") + "</a></div>";
        html += "<hr>";
        html += "<div><a target='_blank' href='http://www.ncbi.nlm.nih.gov/pubmed?term=" + clearname + "[Author]'>PubMed</a></div>";
        html += "<hr>";
        html += "<div><a target='_blank' href='http://scholar.google.com/scholar?q=author:" + clearname + "'>Google Scholar</a></div>";
        html += "</div>";
        ele.popover({
            title: TAPi18n.__("moreContentBy") + "<br><span class='author-pop-name'>" + clearname + "</span>",
            content: html
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
});