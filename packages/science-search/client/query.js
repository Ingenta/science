SolrQuery = {
	session:new ReactiveDict(),
	/**
	 * 增加一个设置项
	 * @param key
	 * @param val
	 */
	addSetting:function(key,val){
		var setting = SolrQuery.session.get("setting") || {};
		setting[key]=val;
		SolrQuery.session.set("setting",setting)
	},
	/**
	 * 增加一个值到ReactiveDict中
	 * @param key
	 * @param val
	 */
	addTo:function(key,val){
		var objArr = SolrQuery.session.get(key) || [];
		objArr.push(val);
		SolrQuery.session.set(key,objArr);
	},
	/**
	 * 增加一个筛选条件
	 * @param qstr
	 */
	addFilterQuery:function(qstr){
		SolrQuery.addTo("filterQuery",qstr);
	},
	/**
	 * 增加一个二次检索条件
	 * @param qstr
	 */
	addSecQuery:function(qstr){
		SolrQuery.addTo("secQuery",qstr);
	},
	/**
	 * 生成一个搜索URL
	 * @param option 带option参数时，表示这是一次新的搜索，若不带option，则从ReactiveDict已有的内容里取值
	 * @returns {string}
	 */
	makeUrl:function(option){
		var queryStr= QueryUtils.getQueryStr(option ? option.query : SolrQuery.session.get("query")) ;
		var fqStrArr= QueryUtils.getFilterQueryStrArr(option ? option.filterQuery : SolrQuery.session.get("filterQuery"));
		var sqStrArr = option ? option.secQuery : SolrQuery.session.get("secQuery");
		var settingStr = QueryUtils.getSettingStr(option ? option.setting : SolrQuery.session.get("setting"));
		if(option && Router.current().route.getName()=='solrsearch'){
			//已经在搜索结果页时，通过通栏检索框进行检索时，清空筛选条件，重新检索
			SolrQuery.session.set("query",queryStr);
			SolrQuery.session.set("filterQuery",fqStrArr);
			SolrQuery.session.set("secQuery",sqStrArr);
			var setting = SolrQuery.session.get("setting") || {};
			SolrQuery.session.set("setting",setting);
		}
		var qString="";
		if(queryStr){
			qString = "?q="+ queryStr;
		}
		if(fqStrArr && fqStrArr.length){
			var l = qString ? "&" : "?";
			qString += (l + "fq=" + fqStrArr.join("&fq="));
		}
		if(sqStrArr && sqStrArr.length){
			var l = qString ? "&" : "?";
			qString += (l + "sq=" + sqStrArr.join("&sq="));
		}
		if(settingStr){
			var l = qString ? "&" : "?";
			qString += l+settingStr;
		}
		return "/search" + qString;
	},
	/**
	 * 搜索方法，主要通过调用这个方法来进行搜索
	 * @param option
	 */
	search : function(option){
		SolrQuery.reset();
		var url=SolrQuery.makeUrl(option);
		Router.go(url);
	},
	/**
	 * 兴趣检索
	 * @param event
	 */
	interstingSearch:function(event){
		event.stopPropagation();
		event.preventDefault();
		var content = Science.dom.getSelContent();
		if(content){
			var trimContent = content.trim();
			if(trimContent.length >2 && trimContent.length < 100){
				var journalId = Session.get('currentJournalId');
				var filterQuery = ["journalId:"+journalId];
				var setting = {rows:5};
				Meteor.call("search",trimContent,filterQuery,undefined,setting,function(err,result){
					var ok = err?false:result.responseHeader.status==0;
					if(ok){
						QueryUtils.interstingSearchPop(trimContent,journalId,result);
					}
				})
			}
		}
	},
	/**
	 * 清空所有搜索选项
	 */
	reset:function(){
		_.each(SolrQuery.session.keys,function(val,key){
			SolrQuery.session.set(key,null);
		});
	}
};

