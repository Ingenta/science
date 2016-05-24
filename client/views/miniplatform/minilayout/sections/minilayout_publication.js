Template.layoutPublications.helpers({
    hasJournal: function(){
        var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
        if(publisher){
            var sort = {};
            if(TAPi18n.getLanguage() === 'zh-CN')sort={"titleCn":1};
            sort={"title":1};
            return Publications.find({publisher:publisher._id,visible:"1"},{sort: sort});
        }
    },
    journalUrl: function(id){
        var journal = Publications.findOne({_id: id}, {fields: {shortTitle: 1, publisher: 1}});
        if (!journal)return;
        var pub = Publishers.findOne({_id: journal.publisher}, {fields: {shortname: 1}});
        if (!pub)return;
        return "http://engine.scichina.com/publisher/" + pub.shortname + "/journal/" + journal.shortTitle;
    }
});

Template.layoutPublications.rendered = function() {
    $('#carousel').slick({
        slidesToShow: 6,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 5000
    });
}