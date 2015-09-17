Template.toggleField.helpers({
    getContent: function(field){
        if (typeof field == "object"){
            if (TAPi18n.getLanguage() === "zh-CN") {
                if (!field.cn)return field.en;
                return field.cn;
            }
            if (!field.en)return field.cn;
            return field.en;
        }else{
            return field;
        }
    }
})
Template.sendEmails.events({
    "click .btn-primary": function () {
        console.log("abc")
        Meteor.call('sendEmail',
            'jack.kavanagh@digitalpublishing.cn',
            'eryaer@sina.com',
            'Hello from Meteor!',
            'Here is an article you might be interested in. \n\n' + Router.current().url);
    }
})

