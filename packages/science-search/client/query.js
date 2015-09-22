SolrQuery = {
	session         : new ReactiveDict(),
	get             : function (key) {
		return SolrQuery.session.get(key);
	},
	set             : function (key, val) {
		SolrQuery.session.set(key, val);
		return SolrQuery;
	},
	add             : function (key, val) {
		var arr = SolrQuery.session.get(key) || [];
		arr.push(val);
		return SolrQuery;
	},
	setting:function(key,val){
		var setting = SolrQuery.get("setting");
		if(!setting)
			setting = {};
		if(key===undefined)
			return setting;
		if(val===undefined){
			return setting[key];
		}else{
			setting[key]=val;
			SolrQuery.set("setting",setting);
			return setting;
		}
	},
	params:function(key,val){
		var params = SolrQuery.get("params");
		if(!params)
			params = {};
		if(key===undefined)
			return params;
		if(val===undefined){
			return params[key];
		}else{
			params[key]=val;
			SolrQuery.set("params",params);
			return params;
		}
	},
	setQuery        : function (val) {
		SolrQuery.params("q",val);
	},
	toggleFilterQuery  : function (field,val,isAdd) {
		var params = SolrQuery.params();
		var currFilter = params.fq && params.fq[field] || [];
		if(isAdd){
			currFilter = _.union(currFilter,[val]);
		}else{
			currFilter = _.without(currFilter,val);
		}
		if(!params.fq){
			params.fq={};
		}
		params.fq[field]=currFilter;
		SolrQuery.params("fq", params.fq);
	},
	addSecondQuery  : function (val) {
		SolrQuery.add("secondQuery", val);
	},
	makeUrl         : function (option) {
		var queryStr   = JSON.stringify(option ? option.query : SolrQuery.params("q"));
		var fqStr   = JSON.stringify(QueryUtils.getFilterQuery(option ? option.filterQuery : SolrQuery.params("fq")));
		var sqStr   = JSON.stringify(option ? option.secondQuery : SolrQuery.params("sq"));
		var settingStr = JSON.stringify(option ? option.setting : SolrQuery.params("st"));
		var qString    = "";
		if (queryStr) {
			qString += "&q=" + queryStr;
		}
		if (fqStr) {
			qString += "&fq=" + fqStr;
		}
		if (sqStr) {
			qString += "&sq=" + fqStr;
		}
		if (settingStr) {
			qString += "&st=" + settingStr;
		}
		if(qString){
			qString= "?"+qString.substr(1)
		}
		return "/search" + qString;
	},
	/**
	 * 搜索方法，主要通过调用这个方法来进行搜索
	 * @param option
	 */
	search          : function (option) {
		SolrQuery.reset();
		var url = SolrQuery.makeUrl(option);
		console.log(url);
		Router.go(url);
	},
	/**
	 * 兴趣检索
	 * @param event
	 */
	interstingSearch: function (event) {
		event.stopPropagation();
		event.preventDefault();
		var content = Science.dom.getSelContent();
		if (content) {
			var trimContent = content.trim();
			if (trimContent.length > 2 && trimContent.length < 100) {
				var journalId   = Session.get('currentJournalId');
				var articleId = Router.current().data() && Router.current().data()._id;
				var fq={};
				if(journalId)
					fq.journalId = journalId;
				if(articleId)
					fq.not_id=articleId;
				var query = {
					q:trimContent,
					fq:fq,
					st:{rows: 5}
				};
				Meteor.call("search", query, function (err, result) {
					var ok = err ? false : result.responseHeader.status == 0;
					if (ok) {
						QueryUtils.interstingSearchPop(event, trimContent, journalId, result);
					}
				})
			}
		}
	},
	/**
	 * 清空所有搜索选项
	 */
	reset           : function () {
		_.each(SolrQuery.session.keys, function (val, key) {
			SolrQuery.session.set(key, null);
		});
	},
	/**
	 * 清空二次检索条件
	 */
	resetSecQuery   : function () {
		SolrQuery.session.set("secondQuery", undefined);
	},

	callSearchMethod: function () {
		var params = QueryUtils.parseUrl();
		SolrQuery.session.set("params",params);
		Meteor.call("search", params, function (err, result) {
			SolrQuery.session.set("params",params);
			var ok = err ? false : result.responseHeader.status == 0;
			SolrQuery.session.set("ok", ok);
			if (ok) {
				if (result.response) {
					SolrQuery.session.set("numFound", result.response.numFound);
					SolrQuery.session.set("start", result.response.start);
					SolrQuery.session.set("docs", result.response.docs);
				}
				if (result.facet_counts) {
					SolrQuery.session.set("facets", result.facet_counts.facet_fields);
				}
				if (result.highlighting) {
					SolrQuery.session.set("highlight", result.highlighting);
				}
			}
		});
	}
};