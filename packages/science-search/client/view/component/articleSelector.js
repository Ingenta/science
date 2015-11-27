Template.solrArticleSelector.onRendered(function(){
	this.$(".solr-article-select").select2(SolrQuery.select2OPtions);
})


Template.solrArticleMarkup.helpers({
	id:function(){
		return this.id;
	},
	showTitle:function(){
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		return isLangCn?this["title.cn"]:this["title.en"];
	}
})