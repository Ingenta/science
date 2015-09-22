Template.selectionSearch.helpers({
	journalTitle:function(){
		var journal = Publications.findOne({_id:this.journalId},{field:{title:1,titleCn:1}});
		if(journal)
			return TAPi18n.getLanguage()==='zh-CN'?journal.titleCn:journal.title;
		return '';
	},
	count:function(){
		return this.result.response.docs.length;
	},
	titles:function(){
		var result=[];
		var lang = TAPi18n.getLanguage()==='zh-CN'?"cn":"en";
		var highlight = this.result.highlighting;
		_.each(this.result.response.docs,function(doc){
			var highlightTitle = highlight[doc._id] && highlight[doc._id]["title."+lang];
			var stitle = doc["title."+lang] || highlightTitle;
			result.push({id:doc._id,'title':stitle});
		});
		return result;
	},
	searchUrl:function(){
		var option = {
			query:this.keyword || "",
			filterQuery:{journalId:this.journalId}
		};
		return SolrQuery.makeUrl(option);
	}
});