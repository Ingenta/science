Template.pageElement.helpers({
    getPageTitle: function (key) {
        var element = Pages.findOne({key: key});
        if (!element) {
            return
        }
        Session.set("thisPageElement", element.key);
        if (TAPi18n.getLanguage() === "zh-CN")
            return element.title.cn;
        return element.title.en;
    },
    getPageDescription: function (key) {
        var element = Pages.findOne({key: key});
        if (!element)return;
        if (!element.description)return;
        if (TAPi18n.getLanguage() === "zh-CN")
            return element.description.cn;
        return element.description.en;
    }
});

Template.updatePagesModalForm.helpers({
    getPageId: function (key) {
        var key = Session.get("thisPageElement")
        var element = Pages.findOne({key: key});
        if (!element) {
            return
        }
        return element._id;
    }
});