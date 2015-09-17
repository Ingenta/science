Template.selectionSearch.helpers({
	journalTitle:function(){
		var journal = Publications.findOne({_id:this.journalId},{field:{title:1,titleCn:1}});
		if(journal)
			return TAPi18n.getLanguage()==='zh-CN'?journal.titleCn:journal.title;
		return '';
	},
	count:function(){
		return this.result.response.docs.length;
	}
})