Template.pageElement.helpers({
    getPageTitle: function (key) {
        var element = Pages.findOne({key: key});
        if(!element){
            return
        }
        Session.set("thisPageElement", element.key);
        if (TAPi18n.getLanguage() === "zh-CN")
            return element.titleCN;
        return element.titleEN;
    },
    getPageDescription: function (key) {
        var element = Pages.findOne({key: key});
        if(!element){
            return
        }
        if (TAPi18n.getLanguage() === "zh-CN")
            return element.descriptionCN;
        return element.descriptionEN;
    }
});

Template.updatePagesModalForm.helpers({
    getPageId: function (key) {
        var key = Session.get("thisPageElement")
        var element = Pages.findOne({key: key});
        if(!element){
            return
        }
        return element._id;
    }
});