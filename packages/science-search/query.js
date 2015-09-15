//SolrQuery = {
//	fieldMap : {
//		"title":["title.cn","title.en"],
//		"doi":["doi"],
//		"issn":["issn","EISSN"],
//		"cn":["CN"],
//		"code":["doi","issn","EISSN","CN"],
//		"keyword":["all_keywords"],
//		"author":["all_authors_en","all_authors_en"],
//		"abstract":["abstract"],
//		"fulltext":["fulltext"]
//	},
//	facetFieldMap:{
//		"publisher":["publisher"],
//		"journalId":["journalId"],
//		"journalTitle":["journal.title","journal.titleCn"],
//		"author":["facet_all_authors_en","facet_all_authors_cn"],
//		"topic":["all_topics"],
//		"year":["year"],
//		"month":["month"],
//		"volume":["volume"],
//		"issue":["issue"],
//		"publishDate":["publishDate"]
//	},
//	getQueryStr:function(queryArr){
//		var qstring;
//		if(queryArr){
//			qstring="";
//			_.each(queryArr,function(sQuery){
//				if(!isFirstOne && sQuery.logicRelation){
//					qstring + " " + sQuery.logicRelation + " ";
//				}
//				isFirstOne=false;
//				var solrFields = SolrQuery.fieldMap[sQuery.key];
//				var subQueues = _.map(solrFields,function(sField){
//					return sField + ":" + sQuery.val;
//				});
//				qstring += "(" + subQueues.join(" OR ") + ")";
//			})
//		}
//		return qstring;
//	},
//	getFilterQueryStr:function(queryArr){
//		var qstring;
//		if(queryArr){
//			qstring="";
//			_.each(queryArr,function(sQuery){
//				if(isFirstOne && sQuery.logicRelation){
//					qstring + " " + sQuery.logicRelation + " ";
//				}
//				isFirstOne=false;
//				var solrFields = SolrQuery.fieldMap[sQuery.key];
//				var subQueues = _.map(solrFields,function(sField){
//					return sField + ":" + sQuery.val;
//				});
//				qstring += "(" + subQueues.join(" OR ") + ")";
//			})
//		}
//		return qstring;
//	},
//	create:function(){
//		var query = {};
//		query.search = function(option){
//			var qstring="";
//			var isFirstOne = true;
//
//			if(option.filterQuery){
//				_.each(option.filterQuery,function(sQuery){
//					if(!isFirstOne && sQuery.logicRelation){
//						qstring + " " + sQuery.logicRelation + " ";
//					}
//					isFirstOne=false;
//					var solrFields = SolrQuery.fieldMap[sQuery.key];
//					var subQueues = _.map(solrFields,function(sField){
//						return sField + ":" + sQuery.val;
//					});
//					qstring += "(" + subQueues.join(" OR ") + ")";
//				})
//			}
//		}
//	}
//};
//
//
//var q = SolrQuery.create();
//q.query({query:[
//	{key:"title",value:"aaa"},
//	{logicRelation:"NOT",key:"code",value:"123123"}
//],filterQuery:[
//	{key:"publisher",value:"ljdfogjojosdf"},
//	{key:"topic",value:"34sfdgdsfsdfsdf"}
//]});