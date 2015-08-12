Future = Npm.require('fibers/future');

Meteor.methods({
	"search":function(query){
		var myFuture = new Future();
		SolrClient.query(query,{facet:true,"facet.field":"publisher"},function(err,response){
			if(!err)
				return myFuture.return(JSON.parse(response));
			myFuture.throw(err);
		});
		return myFuture.wait();

	}
})