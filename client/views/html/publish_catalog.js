Template.publishCatalog.events({
    'click .onUpA': function(event){
        $(event.target).parent().next('div.onDown').toggle();
    }
});
