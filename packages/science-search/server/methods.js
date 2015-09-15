Future = Npm.require('fibers/future');

Meteor.methods({
	"search":function(query,filterQuery){
		console.dir(query)
		var myFuture = new Future();
		var options= {
			"facet":true,
			"facet.field":["publisher","journalId","all_topics","facet_all_authors_cn","facet_all_authors_en","year"],
			"hl":true,
			"hl.fl":"title.en,title.cn,all_authors_cn,all_authors_en,all_topics,year,all_topics,doi,abstract",
			"hl.preserveMulti":true,
			"hl.simple.pre":"<span class='highlight'>",
			"hl.simple.post":"</span>",
		};
		if(!query){
			query="*";
		}
		if(filterQuery){
			options.fq=filterQuery;
		}
		SolrClient.query(query,options,function(err,response){
			if(!err)
				return myFuture.return(JSON.parse(response.content));
			else
				myFuture.throw(err);
		});
		return myFuture.wait();
	}
})