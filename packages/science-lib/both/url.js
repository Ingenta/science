Science.URL={};

Science.URL.articleDetail=function(articleId){
	var article = Articles.findOne({_id: articleId},{fields:{publisher:1,journalId:1,issueId:1,doi:1}});
	if(article){
		var pub = Publishers.findOne({_id: article.publisher});
		if (!pub)return;
		var journal = Publications.findOne({_id: article.journalId});
		if (!journal)return;
		var issue = Issues.findOne({_id: article.issueId});
		if(!issue)return;
		var journalPart = "/publisher/" + pub.name + "/journal/" + journal.title;
		var issuePart= "/" + issue.volume + "/" + issue.issue;
		return journalPart+issuePart+ "/" + article.doi;
	}
}