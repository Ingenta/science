Template.publishCont.events({
    'click .onup': function(event){
        $(event.target).next("ul").toggle();
    }
});
