Template.quickSearchTemplate.helpers({
	journals:function(){
		return Publications.find({},{field:{title:1,titleCn:1}});
	},
	isJournalPage:function(){
		var currRoute = Router.current().route.getName();
		return _.contains(['journal.name','journal.name.volume','article.show','guidelines.show'],currRoute);
	},
	journal:function(){
		var jourId = Session.get('currentJournalId');
		var journal = Publications.findOne({_id:jourId},{field:{title:1,titleCn:1}});
		return journal;
	}
});

Template.quickSearchTemplate.events({
	'click .quick-search':function(e){
		e.stopPropagation();
	},
	'click .qs-submit':function(e){
		e.preventDefault();
		var journalId = Template.instance().$('.qs-journal').val() || Template.instance().$('.qs-journal-hidden').val();
		var volume = Template.instance().$('.qs-volume').val();
		var issue = Template.instance().$('.qs-issue').val();
		var page = Template.instance().$('.qs-page').val();
		var query = {filterQuery:[]};
		journalId && query.filterQuery.push({key:'journalId',val:journalId});
		volume && query.filterQuery.push({key:'volume',val:volume});
		issue && query.filterQuery.push({key:'issue',val:issue});
		page && query.filterQuery.push({key:'page',val:page});
		Template.instance().$('.dropdown-toggle').dropdown('toggle');
		SolrQuery.search(query);
	}
});