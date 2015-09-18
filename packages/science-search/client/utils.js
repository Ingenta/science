QueryUtils = {
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
		"publishDate":["published"]
	},
	getQueryStr:function(queryArr){
		var qstring;
		if(queryArr){
			if(typeof queryArr === 'string')
				return queryArr;
			qstring="";
			var isFirstOne = true;
			_.each(queryArr,function(sQuery){
				if(!isFirstOne && sQuery.logicRelation){
					qstring += " " + sQuery.logicRelation + " ";
				}
				isFirstOne=false;
				var solrFields = QueryUtils.fieldMap[sQuery.key];
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
				var solrFields = QueryUtils.facetFieldMap[sQuery.key];
				if(sQuery.key=='publishDate'){
					if(sQuery.val && (sQuery.val.start || sQuery.val.end)){
						var subQueues = _.map(solrFields,function(sField){
							var start = QueryUtils.getSolrFormat(sQuery.val.start);
							var end = QueryUtils.getSolrFormat(sQuery.val.end);
							return sField + ":[" + start + " TO " + end + "]";
						});
						fqStrArr.push(subQueues.join(" OR "));
					}
				}else{
					var subQueues = _.map(solrFields,function(sField){
						return sField + ":" + sQuery.val;
					});
					fqStrArr.push(subQueues.join(" OR "));
				}
			})
		}
		return fqStrArr;
	},
	getSettingStr:function(setting){
		if(!setting)
			return "";
		var fields = Science.JSON.MergeObject(QueryUtils.fieldMap,QueryUtils.facetFieldMap);
		var settingStr = "";
		_.each(setting,function(val,key){
			if(val){
				if(_.contains(["sort","fl"],key)){
					var splitVal = val.trim().split(' ');
					var field = fields[splitVal[0]] && fields[splitVal[0]][0];
					settingStr+="&"+ key + "="+ field + (splitVal.length > 1 && (" "+splitVal[1]));
				}else{
					settingStr+="&"+key+"="+val;
				}
			}
		});
		return settingStr && settingStr.substr(1);//trim frist &
	},
	getSolrFormat:function(date){
		if(!date || !date.trim())
			return "*";
		if(typeof date === 'string'){
			return new Date(date).toSolrString();
		}else{
			return date.toSolrString();
		}
	}
}