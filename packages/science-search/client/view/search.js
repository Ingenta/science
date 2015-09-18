Meteor.startup(function(){
    Tracker.autorun(function(){
        var query = SolrQuery.pageSession.get("query");
        var filterQuery = SolrQuery.pageSession.get("filterQuery");
	    var querySetting = SolrQuery.pageSession.get("setting") || {};
        Meteor.call("search",query,filterQuery,querySetting,function(err,result){
            var ok = err?false:result.responseHeader.status==0;
            SolrQuery.pageSession.set("ok",ok);
            if(ok){
                if(result.response){
                    SolrQuery.pageSession.set("numFound",result.response.numFound);
                    SolrQuery.pageSession.set("start",result.response.start);
                    SolrQuery.pageSession.set("docs",result.response.docs);
                }
                if(result.facet_counts){
                    SolrQuery.pageSession.set("facets",result.facet_counts.facet_fields);
                }
                if(result.highlighting){
                    SolrQuery.pageSession.set("highlight",result.highlighting);
                }
            }
        })
    });
})

Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            if(Router.current().route.getName()=='solrsearch'){
                //已经在搜索结果页时，通过通栏检索框进行检索时，清空筛选条件，重新检索
	            SolrQuery.pageSession.set("query",sword);
	            SolrQuery.pageSession.set("filterQuery",undefined);
	            SolrQuery.pageSession.set("setting",undefined);
            }
            Router.go('/search?q=' + sword);//从其他页面通过通栏检索进行检索
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                if(Router.current().route.getName()=='solrsearch'){
	                SolrQuery.pageSession.set("query",sword);
	                SolrQuery.pageSession.set("filterQuery",undefined);
	                SolrQuery.pageSession.set("setting",undefined);
                }
                Router.go('/search?q=' + sword);
            }
        }
    }
});

Template.SolrSearchResults.onRendered(function(){
	//刚从其他页跳转过来时，将URL中的检索条件传到pageSession中，触发检索动作
	_.each(Router.current().params.query,function(obj){
		if(Router.current().params.query.q)
			SolrQuery.pageSession.set("query",Router.current().params.query.q);
		if(Router.current().params.query.fq){
			var fq=Science.getParamsFormUrl("fq");
			SolrQuery.pageSession.set("filterQuery",fq);
		}
		else{
			_.each(Router.current().params,function(val,key){
				SolrQuery.set(key,val);
			});
		}
	})
});

Template.SolrSearchResults.helpers({
    'articles': function () {
        return SolrQuery.pageSession.get("docs");
    },
    'statusOK':function(){
        return SolrQuery.pageSession.get("ok");
    },
    'filters': function () {
        var facets = SolrQuery.pageSession.get("facets");
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
        return SolrQuery.pageSession.get("highlight")[this._id];
    }
});




