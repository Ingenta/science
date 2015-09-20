Meteor.startup(function(){
    Tracker.autorun(function(){
        var query = SolrQuery.session.get("query");
        var filterQuery = SolrQuery.session.get("filterQuery");
	    var querySetting = SolrQuery.session.get("setting") || {};
	    var secQuery = SolrQuery.session.get("secQuery");
        Meteor.call("search",query,filterQuery,secQuery,querySetting,function(err,result){
            var ok = err?false:result.responseHeader.status==0;
            SolrQuery.session.set("ok",ok);
            if(ok){
                if(result.response){
                    SolrQuery.session.set("numFound",result.response.numFound);
                    SolrQuery.session.set("start",result.response.start);
                    SolrQuery.session.set("docs",result.response.docs);
                }
                if(result.facet_counts){
                    SolrQuery.session.set("facets",result.facet_counts.facet_fields);
                }
                if(result.highlighting){
                    SolrQuery.session.set("highlight",result.highlighting);
                }
            }
        })
    });
})

Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
	        SolrQuery.search({query:sword});
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
	            SolrQuery.search({query:sword});
            }
        }
    }
});

Template.SolrSearchResults.onRendered(function(){
	//刚从其他页跳转过来时，将URL中的检索条件传到pageSession中，触发检索动作
	_.each(Router.current().params.query,function(obj,key){
		if(key=="q"){
			SolrQuery.set("query",obj);
		}else if(key=="fq"){//筛选检索条件
			var fq=Science.getParamsFormUrl("fq");
			SolrQuery.set("filterQuery",fq);
		}else if(key=="sq"){//二次检索条件
			var sq=Science.getParamsFormUrl("sq");
			SolrQuery.set("secQuery",sq);
		}else{//其他检索条件
            SolrQuery.set(key,obj);
		}
	})
});

Template.SolrSearchResults.helpers({
    'articles': function () {
        return SolrQuery.session.get("docs");
    },
    'statusOK':function(){
        return SolrQuery.session.get("ok");
    },
    'filters': function () {
        var facets = SolrQuery.session.get("facets");
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
                            journal && filter.filterOptions.push({
                                name:journal.title,
                                cname:journal.titleCn,
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
        return SolrQuery.session.get("highlight")[this._id];
    },
    'isFromTopic':function(){
        return SolrQuery.getSetting("from") === 'topic';
    }
});




