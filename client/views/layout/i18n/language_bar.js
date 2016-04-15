Template.i18n_switch.events({
    // set language to context tag
    'click .tap-i18n-buttons a': function (event, tmpl) {
        var id = $(event.currentTarget).attr('id')
        return TAPi18n.setLanguageAmplify(id);
    }
});

Template.i18n_switch.helpers({
    miniPlatform : function(){
        return Router.current().url.indexOf("miniplatform")>-1
    }
});

TAPi18n._afterUILanguageChange = function () {
//triggers on language switch
    mo.setLocale(TAPi18n.getLanguage());
    document.title = TAPi18n.__("Science China Press");
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