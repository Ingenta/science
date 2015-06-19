Template.i18n_switch.events({
    // set language to context tag
    'click .tap-i18n-buttons a': function(event,tmpl){
        var id=$(event.currentTarget).attr('id')
        return TAPi18n.setLanguageAmplify(id)
    }
});
TAPi18n._afterUILanguageChange = function(){
//triggers on language switch
//alert(TAPi18n.getLanguage());
    mo.setLocale(TAPi18n.getLanguage())
};
