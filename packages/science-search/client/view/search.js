var pageSession = new ReactiveDict();


Meteor.startup(function(){
    Tracker.autorun(function(){
        var query = pageSession.get("query");
        Meteor.call("search",query,function(err,result){
            var ok = err?false:result.responseHeader.status==0;
            pageSession.set("ok",ok);
            if(ok){
                //pageSession.set("qtime",err?undefined:result.responseHeader.QTime);
                if(result.response){
                    pageSession.set("numFound",result.response.numFound);
                    pageSession.set("start",result.response.start);
                    pageSession.set("docs",undefined);
                    pageSession.set("docs",result.response.docs);
                }
                if(result.facet_counts){
                    pageSession.set("facets",result.facet_counts.facet_fields);
                }
                if(result.highlighting){
                    pageSession.set("highlight",result.highlighting);
                }
            }
        })
    });
})

Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            var query="title.cn:" + sword + " OR title.en:"+ sword ;
            Router.go('/search?q=' + query);
            if(Router.current().route.getName()=='solrsearch'){
                pageSession.set("query",query);
            }
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                var query="title.cn:" + sword + " OR title.en:"+ sword ;
                Router.go('/search?q=' + query);
            }
            if(Router.current().route.getName()=='solrsearch'){
                pageSession.set("query",query);
            }
        }
    }
});

Template.SolrSearchResults.onRendered(function(){
    if(Router.current().params.query.q){
        pageSession.set("query",Router.current().params.query.q);
    }
});

Template.SolrSearchResults.helpers({
    'articles': function () {
        return pageSession.get("docs");
    },
    'statusOK':function(){
        return pageSession.get("ok");
    },
    'filters': function () {
        var facets = pageSession.get("facets");
        if(facets){
            var fields = Object.keys(facets);
            var results = [];
            for(var i=0;i<fields.length;i++){
                var filter = {filterOptions:[]};
                if(fields[i]=='publisher'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Publisher");
                    var facetPublisher = facets[fields[i]];
                    for(var j=0;j<facetPublisher.length;j+=2){
                        var publisher= Publishers.findOne({_id:facetPublisher[j]});
                        filter.filterOptions.push({name:publisher.name,cname:publisher.chinesename,count:facetPublisher[j+1]})
                    }
                    results.push(filter);
                }
            }
            return results;
        }
    },
    'highlightFields': function(){
        console.log('hl')
        return pageSession.get("highlight")[this._id];
    }
});


Template.oneSolrArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    },
    query      : function () {
        return Router.current().params.searchQuery;
    },
    article:function(){
        return Articles.findOne({_id:this._id});
    },
    showTitle:function(){
    	var isLangCn = TAPi18n.getLanguage()==="zh-CN";
    	var hl = pageSession.get("highlight")[this._id];
    	if(hl && (hl["title.cn"] || hl["title.en"])){
    		if(isLangCn && hl["title.cn"])
    			return hl["title.cn"];
    		else if(!isLangCn && hl["title.en"])
    			return hl["title.en"];
    	}
    	return isLangCn?this.title.cn:this.title.en;
    }
});

Template.oneSolrArticle.events({
    "click .btn-delete-article": function () {
        var articleId = this._id;
        sweetAlert({
            title             : TAPi18n.__("Warning"),
            text              : TAPi18n.__("Confirm_delete"),
            type              : "warning",
            showCancelButton  : true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText : TAPi18n.__("Do_it"),
            cancelButtonText  : TAPi18n.__("Cancel"),
            closeOnConfirm    : false
        }, function () {
            Articles.remove({_id:articleId});
            sweetAlert({
                title:TAPi18n.__("Deleted"),
                text:TAPi18n.__("Operation_success"),
                type:"success",
                timer:2000
            });
        });
    }
})