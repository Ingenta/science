Template.relatedArticles.onRendered(function(){
	if(_.isEmpty(this.data.topic))
		return;
	var query = {
		q:this.data.title.cn || "" + " " + this.data.title.en || "",
		fq: {
			topic: {
				operator: "OR",
				val     : this.data.topic
			},
			not_id:this.data._id
		},
		st:{
			facet:false,
			hl:false,
			fl:"_id"
		}
	};
	Meteor.call("search", query, function (err, result) {
		var ok = err ? false : result.responseHeader.status == 0;
		if (ok) {
			Session.set("relatedArticlesIdList",result.response.docs);
		}
	})
});

Template.relatedArticles.helpers({
	'relatedList':function(){
		return Session.get("relatedArticlesIdList");
	},
	'article':function(){
		return Articles.findOne({_id:this._id},{fields:{fulltext:0}})
	}
});