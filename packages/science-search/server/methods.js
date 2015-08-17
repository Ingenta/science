Future = Npm.require('fibers/future');

Meteor.methods({
	"search":function(query){
		var myFuture = new Future();
		var options= {
			"facet":true,
			"facet.field":"publisher",
			"hl":true,
			"hl.fl":"title.en,title.cn",
			"hl.simple.pre":"<span class='highlight'>",
			"hl.simple.post":"</span>",
			"wt":"json"
		};
		SolrClient.query(query,options,function(err,response){
			if(!err)
				return myFuture.return(JSON.parse(response));
			myFuture.throw(err);
		});
		return myFuture.wait();
	}
})