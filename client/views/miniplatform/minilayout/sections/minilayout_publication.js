Template.layoutPublications.rendered = function () {
    build();
};

Template.layoutPublications.helpers({
    hasJournal: function(){
        return Publications.find({"publisher": "hSsscs85HXuu2qTfJ"});
    },
    getJournalUrl:function(){
        return "/miniplatform/" + "authorCentered/" + this.title
    }
});
//
//Template.layoutPublications.events({
//    'click .next' : function(){
//        owl.trigger('owl.next');
//    },
//    'click .prev' : function(){
//        owl.trigger('owl.prev');
//    },
//    'click .play' : function(){
//        owl.trigger('owl.play',1000);
//    },
//    'click .stop' : function(){
//        owl.trigger('owl.stop');
//    }
//})
var build = function(){
    $(document).ready(function() {
        var owl = $("#owl-demo");
        owl.owlCarousel({
            items : 10, //10 items above 1000px browser width
            itemsDesktop : [1000,5], //5 items between 1000px and 901px
            itemsDesktopSmall : [900,3], // betweem 900px and 601px
            itemsTablet: [600,2], //2 items between 600 and 0
            itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
        });
        // Custom Navigation Events
        $(".next").click(function(){
            console.log("111");
            owl.trigger('owl.next');
        })
        $(".prev").click(function(){
            owl.trigger('owl.prev');
        })
        $(".play").click(function(){
            owl.trigger('owl.play',1000); //owl.play event accept autoPlay speed as second parameter
        })
        $(".stop").click(function(){
            owl.trigger('owl.stop');
        })
    });
}


