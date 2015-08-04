Template.sidebarAd.helpers({
    advertisement: function () {
        //判断当前路径是不是期刊或者期刊下属的页面
        var isJournalPage=_.contains(Config.ADPages.journal,Router.current().route.getName());
        var type =isJournalPage?"2":"1";
        var query = {types:type};
        if(isJournalPage){
            query.publications=Session.get('currentJournalId');
        }
        return Advertisement.find(query);
    },
    isADPage:function(){
        return _.contains(Config.ADPages.global,Router.current().route.getName())
            || _.contains(Config.ADPages.journal,Router.current().route.getName());
    },
    AdCount:function(){
        var isJournalPage=_.contains(Config.ADPages.journal,Router.current().route.getName());
        var type =isJournalPage?"2":"1";
        var query = {types:type};
        if(isJournalPage){
            query.publications=Session.get('currentJournalId');
        }
        if(4 < Advertisement.find(query).count()){
            return false;
        }
        return true;
    }
});

AutoForm.addHooks(['addAdvertisementModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            var isJournalPage=_.contains(Config.ADPages.journal,Router.current().route.getName());
            var type =isJournalPage?2:1;
            doc.types = type;
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);