SolrQuery = {
	fieldMap : {
		"title":["title.cn","title.en"],
		"doi":["doi"],
		"issn":["issn","EISSN"],
		"cn":["CN"],
		"code":["doi","issn","EISSN","CN"],
		"journalTitle":["journal.title","journal.titleCn"],
		"keyword":["all_keywords"],
		"author":["all_authors_en","all_authors_en"],
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
		"publishDate":["publishDate"]
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
		return "q="+encodeURIComponent(qstring || "");
	},
	getFilterQueryStr:function(queryArr){
		console.log(queryArr);
		var qstring;
		if(queryArr){
			qstring="";
			_.each(queryArr,function(sQuery){
				isFirstOne=false;
				var solrFields = SolrQuery.facetFieldMap[sQuery.key];
				var subQueues = _.map(solrFields,function(sField){
					return sField + ":" + sQuery.val;
				});
				qstring +=  "&fq=" + encodeURIComponent(subQueues.join(" OR "));
			})
		}
		return qstring || "";
	},
	create:function(){
		var query = {};
		query.search = function(option){
			var qString= SolrQuery.getQueryStr(option.query);
			var fqString= SolrQuery.getFilterQueryStr(option.filterQuery);
			Router.go('/search?' + qString + fqString);
		};
		return query;
	}
};

