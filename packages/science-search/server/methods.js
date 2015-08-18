Future = Npm.require('fibers/future');

Meteor.methods({
	"search":function(query,filterQuery){
		var myFuture = new Future();
		var options= {
			"facet":true,
			"facet.field":["publisher","journalId","all_topics","facet_all_authors_cn","facet_all_authors_en","year"],
			"hl":true,
			"hl.fl":"title.en,title.cn",
			"hl.simple.pre":"<span class='highlight'>",
			"hl.simple.post":"</span>",
		};
		if(filterQuery){
			options.fq=filterQuery;
		}
		SolrClient.query(query,options,function(err,response){
			if(!err)
				return myFuture.return(JSON.parse(response));
			myFuture.throw(err);
		});
		return myFuture.wait();
	}
})