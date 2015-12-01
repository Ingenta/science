Template.solrArticleSelector.onRendered(function(){
	var options = SolrQuery.select2Options();
	var userOptions = !_.isEmpty(this.data) && this.data.select2Options;
	if(!_.isEmpty(userOptions)){
		options=Science.JSON.MergeObject(userOptions,options)
	}
	Science.dom.recordSelect2(this.$(".solr-article-select").select2(options));
})

Template.solrArticleMarkup.helpers({
	showTitle:function(){
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		return isLangCn?this["title.cn"]:this["title.en"];
	}
})

Template.solrArticleFilter.helpers({
	options:function(){

		return [{
			_id:"1",
			attrs:"",
			caption:"1"
		},{
			_id:"2",
			attrs:"",
			caption:"2"
		}];
	},
	setting:function(){
		return {
			enableCollapsibleOptGroups: true,
			disableIfEmpty:true,
			disabledText: 'Disabled ...'
		}
	}
})