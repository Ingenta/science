Template.oneSolrArticleNoHighlight.helpers({
	getAuthors:function(){
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		return this["all_authors_"+isLangCn?"cn":"en"];
	},
	query      : function () {
		return Router.current().params.searchQuery;
	},
	article:function(){
		return Articles.findOne({_id:this._id});
	},
	showTitle:function(){
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		return isLangCn?this["title.cn"]:this["title.en"];
	},
	class:function(){
		//return "fa fa-language";
	},
	articleUrl:function(){//TODO: use helper
		var journal = Publications.findOne({_id: this.journalId},{fields:{shortTitle:1,publisher:1}});
		if (!journal)return;
		var pub = Publishers.findOne({_id: journal.publisher},{fields:{shortname:1}});
		if (!pub)return;
		if(!this.volume) return;
		if(!this.issue) return;
		if(!this.doi) return;
		return "/publisher/" + pub.shortname + "/journal/" + journal.shortTitle+"/"+this.volume + "/"+this.issue+"/"+this.doi;
	}
})