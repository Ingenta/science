Template.recentReadAndSearchContainer.helpers({
	recentReads:function(){
		return Users.recent.read();
	},
	recentSearchs:function(){
		return Users.recent.search();
	},
	searchUrl:function(){
		return SolrQuery.makeUrl({query:this.toString(),setting:{from:"history"}});
	},
	article:function(){
		return Articles.findOne({_id:this.toString()});
	},
	anyThingNeedShow:function(){
		return !(_.isEmpty(Users.recent.read())
				&& _.isEmpty(Users.recent.search())
		);
	}
})