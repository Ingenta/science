SolrQuery = {
	pageSession:new ReactiveDict(),
	set:function(key,val){
		var setting = SolrQuery.pageSession.get("setting") || {};
		setting[key]=val;
		SolrQuery.pageSession.set("setting",setting)
	},
	makeUrl:function(option){
		var queryStr= QueryUtils.getQueryStr(option.query);
		var fqStrArr= QueryUtils.getFilterQueryStrArr(option.filterQuery);
		var settingStr = QueryUtils.getSettingStr(option.setting);
		if(Router.current().route.getName()=='solrsearch'){
			//已经在搜索结果页时，通过通栏检索框进行检索时，清空筛选条件，重新检索
			SolrQuery.pageSession.set("query",queryStr);
			SolrQuery.pageSession.set("filterQuery",fqStrArr);
			var setting = SolrQuery.pageSession.get("setting") || {};
			SolrQuery.pageSession.set("setting",setting);
		}
		var qString="";
		if(queryStr){
			qString = "?q="+ queryStr;
		}
		if(fqStrArr && fqStrArr.length){
			var l = qString ? "&" : "?";
			qString += (l + "fq=" + fqStrArr.join("&fq="));
		}
		if(settingStr){
			var l = qString ? "&" : "?";
			qString += l+settingStr;
		}
		return "/search" + qString;
	},
	search : function(option){
		var url=SolrQuery.makeUrl(option);
		Router.go(url);
	},
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
							title:TAPi18n.__("interstingSearch"),
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

