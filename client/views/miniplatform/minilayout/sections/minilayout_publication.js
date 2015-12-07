Template.layoutPublications.helpers({
    hasJournal: function(){
        var publisher = Publishers.find({name : Config.miniplatformPublisherName});
        if(publisher)return Publications.find({publisher:publisher._id});
    },
    publisherUrl: function(){
        var publisher = Publishers.find({name : Config.miniplatformPublisherName});
        if(publisher)return "/publisher/"+publisher.name;
    }
});

Template.layoutPublications.rendered = function() {
    $('#carousel').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    });
}