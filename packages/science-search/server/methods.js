Meteor.methods({
	"search":function(query){
		SolrClient.query(query,function(err,response){
			if(!err)
				return response;
		})
	}
})