Template.layoutPublications.helpers({
    hasJournal: function(){
        var publisher = Publishers.findOne({agree:true});
        if(publisher)return Publications.find({publisher:publisher._id});
    },
    getJournalUrl:function(){
        var publisher = Publishers.findOne({agree:true});
        if(publisher)return "/publisher/"+publisher.name+"/journal/"+this.title;
    },
    publisherUrl: function(){
        var publisher = Publishers.findOne({agree:true});
        if(publisher)return "/publisher/"+publisher.name;
    }
});

Template.layoutPublications.rendered = function() {
    $('#carousel').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    });
}