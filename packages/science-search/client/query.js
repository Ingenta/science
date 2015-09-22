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
				var query = {
					query:(trimContent),
					filterQuery:{"journalId":journalId},
					setting:{rows: 5}
				};
				Meteor.call("search", query, function (err, result) {
					var ok = err ? false : result.responseHeader.status == 0;
					if (ok) {
						QueryUtils.interstingSearchPop(trimContent, journalId, result);
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

//SolrQuery = {
//	session:new ReactiveDict(),
//	/**
//	 * 增加一个设置项
//	 * @param key
//	 * @param val
//	 */
//	set:function(key,val){
//		var setting = SolrQuery.getSetting() || {};
//		setting[key] = val;
//		SolrQuery.session.set("setting",setting);
//	},
//	getSetting:function(key){
//		var setting = SolrQuery.session.get("setting");
//		return (key && setting) ? setting[key] : setting;
//	},
//	/**
//	 * 增加一个值到ReactiveDict中
//	 * @param key
//	 * @param val
//	 */
//	addTo:function(key,val){
//		var objArr = SolrQuery.session.get(key) || [];
//		objArr.push(val);
//		SolrQuery.session.set(key,objArr);
//	},
//	/**
//	 * 增加一个筛选条件
//	 * @param qstr
//	 */
//	addFilterQuery:function(qstr){
//		console.log(qstr);
//		SolrQuery.addTo("filterQuery",qstr);
//	},
//	/**
//	 * 增加一个二次检索条件
//	 * @param qstr
//	 */
//	addSecQuery:function(qstr){
//		SolrQuery.addTo("secQuery",qstr);
//	},
//	/**
//	 * 生成一个搜索URL
//	 * @param option 带option参数时，表示这是一次新的搜索，若不带option，则从ReactiveDict已有的内容里取值
//	 * @returns {string}
//	 */
//	makeUrl:function(option){
//		var queryStr= QueryUtils.getQueryStr(option ? option.query : SolrQuery.session.get("query")) ;
//		var fqStrArr= QueryUtils.getFilterQueryStrArr(option ? option.filterQuery :
// SolrQuery.session.get("filterQuery")); var sqStrArr = option ? option.secQuery : SolrQuery.session.get("secQuery");
// var settingStr = QueryUtils.getSettingStr(option ? option.setting : SolrQuery.session.get("setting")); //if(option
// && Router.current().route.getName()=='solrsearch'){ //已经在搜索结果页时，通过通栏检索框进行检索时，清空筛选条件，重新检索
// //SolrQuery.session.set("query",queryStr); //SolrQuery.session.set("filterQuery",fqStrArr);
// //SolrQuery.session.set("secQuery",sqStrArr); //var setting = SolrQuery.session.get("setting") || {};
// //SolrQuery.session.set("setting",setting); //} var qString=""; if(queryStr){ qString = "?q="+ queryStr; }
// if(fqStrArr && fqStrArr.length){ var l = qString ? "&" : "?"; qString += (l + "fq=" + fqStrArr.join("&fq=")); }
// if(sqStrArr && sqStrArr.length){ var l = qString ? "&" : "?"; qString += (l + "sq=" + sqStrArr.join("&sq=")); }
// if(settingStr){ var l = qString ? "&" : "?"; qString += l+settingStr; } return "/search" + qString; }, /** *
// 搜索方法，主要通过调用这个方法来进行搜索 * @param option */ search : function(option){ SolrQuery.reset(); var
// url=SolrQuery.makeUrl(option); Router.go(url); }, /** * 兴趣检索 * @param event */ interstingSearch:function(event){
// event.stopPropagation(); event.preventDefault(); var content = Science.dom.getSelContent(); if(content){ var
// trimContent = content.trim(); if(trimContent.length >2 && trimContent.length < 100){ var journalId =
// Session.get('currentJournalId'); var filterQuery = ["journalId:"+journalId]; var setting = {rows:5};
// Meteor.call("search",trimContent,filterQuery,undefined,setting,function(err,result){ var ok =
// err?false:result.responseHeader.status==0; if(ok){ QueryUtils.interstingSearchPop(trimContent,journalId,result); }
// }) } } }, /** * 清空所有搜索选项 */ reset:function(){ _.each(SolrQuery.session.keys,function(val,key){
// SolrQuery.session.set(key,null); }); }, /** * 清空二次检索条件 */ resetSecQuery:function(){
// SolrQuery.session.set("secQuery",undefined); },  callSearchMethod:function(){ console.log('callSearchMethod'); var
// params = QueryUtils.parseUrl(); Meteor.call("search",params,function(err,result){ var ok = err?false:result.responseHeader.status==0; SolrQuery.session.set("ok",ok); if(ok){ if(result.response){ SolrQuery.session.set("numFound",result.response.numFound); SolrQuery.session.set("start",result.response.start); SolrQuery.session.set("docs",result.response.docs); } if(result.facet_counts){ SolrQuery.session.set("facets",result.facet_counts.facet_fields); } if(result.highlighting){ SolrQuery.session.set("highlight",result.highlighting); } } }); } };
