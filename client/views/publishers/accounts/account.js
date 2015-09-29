Template.publisherAccountTemplate.helpers({
    "getPublisherNameById": function () {
        return Publishers.findOne({_id: Router.current().params.pubId}, {chinesename:1, name: 1});
    }
});