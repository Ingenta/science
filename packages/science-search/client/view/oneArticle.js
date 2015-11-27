Template.oneSolrArticle.helpers({
	getAuthors:function(){
		var hl = SolrQuery.session.get("highlight")[this._id];
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		if(hl && hl[isLangCn?"all_authors_cn":"all_authors_en"]){
			return hl[isLangCn?"all_authors_cn":"all_authors_en"];
		}else{
			return this["all_authors_"+isLangCn?"cn":"en"];
		}
	},
	query      : function () {
		return Router.current().params.searchQuery;
	},
	article:function(){
		return Articles.findOne({_id:this._id});
	},
	showTitle:function(){
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		var hl = SolrQuery.session.get("highlight")[this._id];
		if(hl && (hl["title.cn"] || hl["title.en"])){
			if(isLangCn && hl["title.cn"])
				return hl["title.cn"];
			else if(!isLangCn && hl["title.en"])
				return hl["title.en"];
		}
		return isLangCn?this["title.cn"]:this["title.en"];
	},
	showdoi:function(){
		var hl = SolrQuery.session.get("highlight")[this._id];
		if(hl && hl["doi"]){
			return hl["doi"];
		}
		return this.doi;
	},
	class:function(){
		//return "fa fa-language";
	},
	articleUrl:function(){
		var journal = Publications.findOne({_id: this.journalId},{fields:{shortTitle:1,publisher:1}});
		if (!journal)return;
		var pub = Publishers.findOne({_id: journal.publisher},{fields:{name:1}});
		if (!pub)return;
		if(!this.volume) return;
		if(!this.issue) return;
		if(!this.doi) return;
		return "/publisher/" + pub.name + "/journal/" + journal.shortTitle+"/"+this.volume + "/"+this.issue+"/"+this.doi;
	}
});

Template.oneSolrArticle.events({
	"click .btn-delete-article": function () {
		var articleId = this._id;
		confirmDelete(e,function(){
			Articles.remove({_id:articleId});
		});
	}
})