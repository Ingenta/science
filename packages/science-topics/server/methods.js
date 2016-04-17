Meteor.methods({
    'getOneTopic':function(topicId){
        check(topicId, String);
        return Topics.findOne({_id:topicId});
    }
})