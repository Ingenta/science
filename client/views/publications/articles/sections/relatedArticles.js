Template.relatedArticles.onRendered(function(){
	var topics= _.compact(this.data.topic);
	var fq={};
	if(this.data._id)
		fq.not_id=this.data._id;
	if(!_.isEmpty(topics)){
		fq.topic = {
			operator: "OR",
			val     : topics
		};
	}
	var title = Science.JSON.try2GetRightLangVal(this.data.title);
	var query = {
		q: title.replace(":","\\:"),
		fq:fq,
		st:{rows: 10}
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
	}
});