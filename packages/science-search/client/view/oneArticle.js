Template.oneSolrArticle.helpers({
	journalName: function (id) {
		var journal = Publications.findOne({_id: id});
		return journal && (TAPi18n.getLanguage()==="zh-CN"?journal.titleCn:journal.title);
	},
	getAutors:function(){
		var hl = SolrQuery.session.get("highlight")[this._id];
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		if(hl && hl[isLangCn?"all_authors_cn":"all_authors_en"]){
			return hl[isLangCn?"all_authors_cn":"all_authors_en"];
		}else{
			return this.authors;
		}
	},
	getFullName: function () {
		if(this.surname || this.given){
			if (TAPi18n.getLanguage() === "zh-CN")
				return this.surname.cn + this.given.cn;
			return this.given.en + " " + this.surname.en;
		}else{
			return this + "";
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
		return isLangCn?this.title.cn:this.title.en;
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