Template.quickSearchTemplate.helpers({
	journals:function(){
		return Publications.find({},{field:{title:1,titleCn:1}});
	}
});

Template.quickSearchTemplate.events({
	'click .quick-search':function(e){
		e.preventDefault();
		e.stopPropagation();
	},
	'click .qs-submit':function(e){
		e.preventDefault();
		console.log('aa');
		var journalId = $('.qs-journal-selector').val();
		var volume = $('.qs-volume').val();
		var issue = $('.qs-issue').val();
		var page = $('.qs-page').val();
		var query = {filterQuery:[]};
		journalId && query.filterQuery.push({key:'journalId',val:journalId});
		volume && query.filterQuery.push({key:'volume',val:journalId});
		issue && query.filterQuery.push({key:'issue',val:journalId});
		page && query.filterQuery.push({key:'page',val:journalId});
		console.log(query);
		SolrQuery.create().search(query);
	}
});