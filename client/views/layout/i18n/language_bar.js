Template.i18n_switch.events({
    // set language to context tag
    'click .tap-i18n-buttons a': function (event, tmpl) {
        var id = $(event.currentTarget).attr('id')
        return TAPi18n.setLanguageAmplify(id);
    }
});
TAPi18n._afterUILanguageChange = function () {
//triggers on language switch
    mo.setLocale(TAPi18n.getLanguage());
    debugger
    if(TAPi18n.afterChangeHook){
        _.map(TAPi18n.afterChangeHook,function(hook,key){
            hook && hook();
        })
    }
};

TAPi18n.addChangeHook=function(name, func){
    if(!TAPi18n.afterChangeHook){
        TAPi18n.afterChangeHook = {};
    }
    TAPi18n.afterChangeHook[name] = func;
}