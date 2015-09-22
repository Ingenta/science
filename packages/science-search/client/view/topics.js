Template.relatedTopicLists.helpers({
	currTopic:function(){
		if(SolrQuery.params("st") && SolrQuery.params("st").from ==='topic' && SolrQuery.params("fq")){
			var fq =SolrQuery.params("fq");
			if(!_.isEmpty(fq.topic)){
				return Topics.findOne({_id:fq.topic[0]});
			}
		}
	},
	pageDesc:function(){
		var p = Pages.findOne({key:'topic'});
		if(p && p.description)
			return TAPi18n.getLanguage()==='zh-CN'? p.description.cn: p.description.en;
		return "";
	},
	parentTopic:function(){
		return Topics.find({_id:this.parentId});
	},
	subTopics:function(){
		return Topics.find({parentId:this._id});
	},
	relatedTopics:function(){
		if(_.isEmpty(this.relatedTopics)){
			return Topics.find({relatedTopics:this._id});
		}else{
			return Topics.find({$or:[{relatedTopics:this._id},{_id:{$in:this.relatedTopics}}]})
		}
	}
});

Template.topicListInSearchResult.events({
	'click a':function(e){
		e.preventDefault();
		SolrQuery.changeFilterQuery('topic',this._id);
		Router.go(SolrQuery.makeUrl());
	}
})