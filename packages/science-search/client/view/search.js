var pageSession = new ReactiveDict();

Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            var query="title.cn:" + sword + " OR title.en:"+ sword ;
            Router.go('/search?q=' + query);
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                var query="title.cn:" + sword + " OR title.en:"+ sword ;
                Router.go('/search?q=' + query);
            }
        }
    }
});

Template.SolrSearchResults.onRendered(function(){
    var q = Router.current().params.query.q;
    if (q) {
        Meteor.call("search",q,function(err,result){
            var ok = err?false:result.responseHeader.status==0;
            pageSession.set("ok",ok);
            if(ok){
                //pageSession.set("qtime",err?undefined:result.responseHeader.QTime);
                if(result.response){
                    pageSession.set("numFound",result.response.numFound);
                    pageSession.set("start",result.response.start);
                    pageSession.set("docs",result.response.docs);
                }
                if(result.facet_counts){
                    pageSession.set("facets",result.facet_counts.facet_fields);
                }
            }
        })
    }
})

Template.SolrSearchResults.helpers({
    'articles': function () {
        return pageSession.get("docs");
    },
    'statusOK':function(){
        return pageSession.get("ok");
    },
    'filters': function () {
        debugger
        var facets = pageSession.get("facets");
        if(facets && facets.length){
            var fields = Object.keys(facets);
            var results = [];
            for(var i=0;i<fields.length;i++){
                var filter = {filterOptions:[]};
                if(fields[i]=='publisher'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Publisher");
                    for(var j=0;i<fields[i].length;j+=2){
                        var publisher= Publishers.findOne({_id:fields[i][j]});
                        filter.filterOptions.push({name:publisher.name,cname:publisher.chinesename,count:fields[i][j+1]})
                    }
                    results.push(filter);
                }
            }
            console.log(results);
            return results;
        }
    }
});


