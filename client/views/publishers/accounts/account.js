Template.publisherAccountTemplate.helpers({
    "getPublisherNameById": function () {
        return Publishers.findOne({_id: Router.current().params.pubId}, {chinesename:1, name: 1});
    },
    "scope":function(){
        var scopeObj = {};
        if(Router.current().params.pubId)
            scopeObj.publisherId=Router.current().params.pubId;
        return scopeObj;
    }
});