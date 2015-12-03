Template.saSelectorForTopics.events({
    'click button':function(e,t){
        e.preventDefault();
        var newOne = t.$("#saSelectorForTopics").select2('val');
        Meteor.subscribe("oneArticleMeta",newOne,{
            onReady:function(){
                var article = Articles.findOne({_id : newOne})
                var newest = _.compact(_.union(Router.current().params.topicsId, article.topic))
                Articles.update({_id: newOne}, {$set: {topic: newest}});
            }
        })
    }
})