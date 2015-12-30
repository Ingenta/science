Template.layoutPublications.helpers({
    hasJournal: function(){
        var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
        if(publisher)return Publications.find({publisher:publisher._id});
    },
    publisherUrl: function(){
        var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
        if(publisher)return "/publisher/"+publisher.name;
    }
});

Template.layoutPublications.rendered = function() {
    $('#carousel').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    });
}