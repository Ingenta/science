Template.recentReadAndSearchContainer.helpers({
	recentlyRead:function(){
		return Users.recent.read();
	},
	recentlySearched:function(){
		return Users.recent.search();
	},
	searchUrl:function(){
		return SolrQuery.makeUrl({query:this.toString(),setting:{from:"history"}});
	},
	anyRecentUse:function(name){
		if(!name)
			return !(_.isEmpty(Users.recent.read())
					&& _.isEmpty(Users.recent.search())
			);
		else if(name==='read')
			return !_.isEmpty(Users.recent.read());
		else if(name==='search')
			return !_.isEmpty(Users.recent.search());
	}
});