Template.addArticleForCollection.helpers({
	collInfo:function(){
		var coll = ArticleCollections.findOne({_id:Router.current().params.collId})
		Session.set("publisherId",coll.publisherId);
		return coll;
	}

});

Template.addArticleForCollection.events({
	"click .search-btn":function(){
		var qf = $(".queryField");
		var q ={};
		_.each(qf,function(item){
			debugger;
			var val = $(item).val();
			if(val){
				var qfield=$(item).data().queryfield;
				val = qfield=='title'?{$regex:val , $options: "i"}:val;
				q[$(item).data().queryfield]=val;
			}
		});
		Session.set("query",q);
	}
});

Template.searchResultForAddToCollection.helpers({
	articles:function(){
		var query = Session.get("query")?Session.get("query"):{};
		return Articles.find(query);
	}
});


Template.searchArticleForAddToCollection.helpers({
	journals:function(){
		return Publications.find({publisher:Session.get("publisherId")},{title:1});
	}
});