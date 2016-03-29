Meteor.methods({
    'getOneTopic':function(topicId){
        return Topics.findOne({_id:topicId});
    }
})