//ReactiveDict的有效范围似乎限于本JS文件内，所以暂时不分成多个文件。
var pageSession = new ReactiveDict();


Meteor.startup(function(){
    Tracker.autorun(function(){
        var query = pageSession.get("query");
        var filterQuery = pageSession.get("filterQuery");
        if(query || filterQuery){
            Meteor.call("search",query,filterQuery,function(err,result){
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
                    if(result.highlighting){
                        pageSession.set("highlight",result.highlighting);
                    }
                }
            })
        }
    });
})

Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            if(Router.current().route.getName()=='solrsearch'){
                //已经在搜索结果页时，通过通栏检索框进行检索时，清空筛选条件，重新检索
                pageSession.set("query",sword);
                pageSession.set("filterQuery",undefined);
            }
            Router.go('/search?q=' + sword);//从其他页面通过通栏检索进行检索
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                if(Router.current().route.getName()=='solrsearch'){
                    pageSession.set("query",sword);
                    pageSession.set("filterQuery",undefined);
                }
                Router.go('/search?q=' + sword);
            }
        }
    }
});

Template.SolrSearchResults.onRendered(function(){
    if(Router.current().params.query.q){
        //刚从其他页跳转过来时，将URL中的检索条件传到pageSession中，触发检索动作
        pageSession.set("query",Router.current().params.query.q);
        var fq=Router.current().params.query.fq;
        console.log(fq);
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
                if(fields[i]=='all_topics'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Topic");
                    var facetTopic = facets[fields[i]];
                    for(var j=0;j<facetTopic.length;j+=2){
                        if(facetTopic[j+1]>0){
                            var topic= Topics.findOne({_id:facetTopic[j]});
                            if(topic){
                                filter.filterOptions.push({
                                    name:topic.englishName,
                                    cname:topic.name,
                                    count:facetTopic[j+1],
                                    fq:fields[i]+":"+facetTopic[j].replace(/ /g,'\\ ')
                                })
                            }
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='publisher'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Publisher");
                    var facetPublisher = facets[fields[i]];
                    for(var j=0;j<facetPublisher.length;j+=2){
                        if(facetPublisher[j+1]>0){
                            var publisher= Publishers.findOne({_id:facetPublisher[j]});
                            filter.filterOptions.push({
                                name:publisher.name,
                                cname:publisher.chinesename,
                                count:facetPublisher[j+1],
                                fq:fields[i]+":"+facetPublisher[j]
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='facet_all_authors_cn' && TAPi18n.getLanguage()==='zh-CN'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Author");
                    var facetAuthor = facets[fields[i]];
                    for(var j=0;j<facetAuthor.length;j+=2){
                        if(facetAuthor[j+1]>0){
                            filter.filterOptions.push({
                                name:facetAuthor[j],
                                cname:facetAuthor[j],
                                count:facetAuthor[j+1],
                                fq:fields[i]+":"+facetAuthor[j].replace(/ /g,'\\ ')
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='facet_all_authors_en' && TAPi18n.getLanguage()==='en'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Author");
                    var facetAuthor = facets[fields[i]];
                    for(var j=0;j<facetAuthor.length;j+=2){
                        if(facetAuthor[j+1]>0){
                            filter.filterOptions.push({
                                name:facetAuthor[j],
                                cname:facetAuthor[j],
                                count:facetAuthor[j+1],
                                fq:fields[i]+":"+facetAuthor[j].replace(/ /g,'\\ ')
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='journalId'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Publications");
                    var facetJournal = facets[fields[i]];
                    for(var j=0;j<facetJournal.length;j+=2){
                        if(facetJournal[j+1]>0){
                            var journal= Publications.findOne({_id:facetJournal[j]});
                            filter.filterOptions.push({
                                name:journal.title,
                                cname:journal.title,
                                count:facetJournal[j+1],
                                fq:fields[i]+":"+facetJournal[j]
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='year'){
                    filter.filterTitle=TAPi18n.__("FILTER BY Release Date");
                    var facetYear = facets[fields[i]];
                    for(var j=0;j<facetYear.length;j+=2){
                        if(facetYear[j+1]>0){
                            filter.filterOptions.push({
                                name:facetYear[j],
                                cname:facetYear[j],
                                count:facetYear[j+1],
                                fq:fields[i]+":"+facetYear[j]
                            })
                        }
                    }
                    results.push(filter);
                }
            }
            return results;
        }
    },
    'highlightFields': function(){
        return pageSession.get("highlight")[this._id];
    }
});


Template.oneSolrArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + this.given.cn;
        return this.given.en + " " + this.surname.en;
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
    },
    class:function(){
        //return "fa fa-language";
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

Template.solrFilterItem.events({
    'click a':function(e){
        e.preventDefault();
        var fq=pageSession.get("filterQuery") || [];
        if(this.selStatus){
            fq = _.without(fq,this.fq);
        }else{
            fq = _.union(fq,this.fq)
        }
        pageSession.set("filterQuery",fq);
        console.log(fq)
        var sword=pageSession.get('query');
        Router.go('/search?q=' + sword+'&fq='+fq);
    }
});

Template.solrFilterItem.helpers({
    class:function(){
        var fq=pageSession.get("filterQuery") || [];
        this.selStatus= _.contains(fq,this.fq);
        return this.selStatus?"fa fa-mail-reply":"fa fa-mail-forward";
    }
})