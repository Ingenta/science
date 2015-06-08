Template.i18n_switch.events({
    // set language to context tag
    'click .tap-i18n-buttons a': function(event,tmpl){
        var id=$(event.currentTarget).attr('id')
        console.log(id);
        return TAPi18n.setLanguageAmplify(id)
    }
});
