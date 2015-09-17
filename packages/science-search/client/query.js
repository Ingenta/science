SolrQuery = {
	pageSession:new ReactiveDict(),
	fieldMap : {
		"title":["title.cn","title.en"],
		"doi":["doi"],
		"issn":["issn","EISSN"],
		"cn":["CN"],
		"code":["doi","issn","EISSN","CN"],
		"journalTitle":["journal.title","journal.titleCn"],
		"keyword":["all_keywords"],
		"author":["all_authors_en","all_authors_cn"],
		"affiliation":["all_affiliations_en","all_affiliations_cn"],
		"abstract":["abstract"],
		"fulltext":["fulltext"]
	},
	facetFieldMap:{
		"publisher":["publisher"],
		"journalId":["journalId"],
		"author":["facet_all_authors_en","facet_all_authors_cn"],
		"topic":["all_topics"],
		"year":["year"],
		"month":["month"],
		"volume":["volume"],
		"issue":["issue"],
		"page":["startPage",'elocationId'],
		"publishDate":["publishDate"],
	},
	getQueryStr:function(queryArr){
		var qstring;
		if(queryArr){
			console.dir(queryArr);
			qstring="";
			var isFirstOne = true;
			_.each(queryArr,function(sQuery){
				if(!isFirstOne && sQuery.logicRelation){
					qstring += " " + sQuery.logicRelation + " ";
				}
				isFirstOne=false;
				var solrFields = SolrQuery.fieldMap[sQuery.key];
				var subQueues = _.map(solrFields,function(sField){
					return sField + ":" + sQuery.val;
				});
				qstring += "(" + subQueues.join(" OR ") + ")";
			})
		}
		return qstring || "";
	},
	getFilterQueryStrArr:function(queryArr){
		var fqStrArr = [];
		if(queryArr){
			qstring="";
			_.each(queryArr,function(sQuery){
				isFirstOne=false;
				var solrFields = SolrQuery.facetFieldMap[sQuery.key];
				if(sQuery.key=='publishDate'){

				}
				var subQueues = _.map(solrFields,function(sField){
					return sField + ":" + sQuery.val;
				});
				fqStrArr.push(subQueues.join(" OR "));
			})
		}
		return fqStrArr;
	},
	search : function(option){
		var queryStr= SolrQuery.getQueryStr(option.query);
		var fqStrArr= SolrQuery.getFilterQueryStrArr(option.filterQuery);
		if(Router.current().route.getName()=='solrsearch'){
			//已经在搜索结果页时，通过通栏检索框进行检索时，清空筛选条件，重新检索
			SolrQuery.pageSession.set("query",queryStr);
			SolrQuery.pageSession.set("filterQuery",fqStrArr);
		}
		var qString="";
		if(queryStr){
			qString = "?q="+ queryStr;
		}
		if(fqStrArr && fqStrArr.length){
			var l = qstring ? "&" : "?";
			qString += (l + "fq=" + fqStrArr.join("&fq="));
		}
		Router.go('/search' + qString);
	},
	interstingSearch:function(event){
		var content = Science.dom.getSelContent();
		if(content){
			var trimContent = content.trim();
			if(trimContent.length >2 && trimContent.length < 100){

				var journalId = Session.get('currentJournalId');
				var filterQuery = ["journalId:"+journalId];
				var setting = {rows:5};
				Meteor.call("search",trimContent,filterQuery,setting,function(err,result){
					var ok = err?false:result.responseHeader.status==0;
					if(ok){
						var htmlContent = Blaze.toHTMLWithData(Template.selectionSearch, {
							keyword:trimContent,
							journalId:journalId,
							result:result
						});

						var templateContent = Blaze.toHTML(Template.qsPopTemplate);

						var pointEle = $(".point-ele");
						if(!pointEle || !pointEle.length){
							pointEle=$('<a href="#" class="point-ele" role="button" tabindex="0" data-toggle="popover" ></a>');
							$("body").append(pointEle);
						}
						pointEle.on('hidden.bs.popover',function(){
							pointEle.popover('destroy');
							pointEle.remove();
						});
						pointEle.css({left: event.pageX,top: event.pageY});
						pointEle.popover({
							html:true,
							content:htmlContent,
							title:"兴趣检索",
							trigger:"focus",
							template:templateContent
						});
						pointEle.focus();
					}
				})


			}
		}
	}
};

