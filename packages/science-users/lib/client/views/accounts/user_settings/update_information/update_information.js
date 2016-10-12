var pageSession = new ReactiveDict();

Template.UserSettingsUpdateInformation.rendered = function () {

};

Template.UserSettingsUpdateInformation.events({});

Template.UserSettingsUpdateInformation.helpers({});

Template.UserSettingsUpdateInformationForm.rendered = function () {


    pageSession.set("userSettingsUpdateInformationFormInfoMessage", "");
    pageSession.set("userSettingsUpdateInformationFormErrorMessage", "");

    $("input[autofocus]").focus();
};

Template.UserSettingsUpdateInformationForm.events({
    "submit": function (e, t) {
        e.preventDefault();
        pageSession.set("userSettingsUpdateInformationFormInfoMessage", "");
        pageSession.set("userSettingsUpdateInformationFormErrorMessage", "");

        function submitAction(msg) {
            var userSettingsProfileEditFormMode = "update";
            if (!t.find("#form-cancel-button")) {
                switch (userSettingsProfileEditFormMode) {
                    case "insert":
                    {
                        $(e.target)[0].reset();
                    }
                        ;
                        break;

                    case "update":
                    {
                        var message = msg || TAPi18n.__("Saved");
                        pageSession.set("userSettingsUpdateInformationFormInfoMessage", message);
                    }
                        ;
                        break;
                }
            }

            Router.go("user_settings.update_information", {});
        }

        function errorAction(msg) {
            var message = msg || "Error.";
            pageSession.set("userSettingsUpdateInformationFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function (fieldName, fieldValue) {

            },
            function (msg) {

            },
            function (values) {
                Meteor.call("updateUserAccount", t.data.current_user_data._id, values, function (e) {
                    if (e) errorAction(e.message); else submitAction();
                });
            }
        );

        return false;
    },
    "click #form-cancel-button": function (e, t) {
        e.preventDefault();


        /*CANCEL_REDIRECT*/
    },
    "click #form-close-button": function (e, t) {
        e.preventDefault();

        /*CLOSE_REDIRECT*/
    },
    "click #form-back-button": function (e, t) {
        e.preventDefault();

        /*BACK_REDIRECT*/
    },
    "click #checkAll1": function () {
        $("input[name='profile.publications']").prop("checked", $("#checkAll1").is(":checked"));
    },
    "click #checkAll2": function () {
        $("input[name='profile.topics']").prop("checked", $("#checkAll2").is(":checked"));
    },
    'click .btn-primary': function (e) {
        var str = document.getElementsByName("profile.publications");
        var ids = "";
        for (i = 0; i < str.length; i++) {
            if (str[i].checked) {
                ids += str[i].value + ",";
            }
        }
        $(e.target).prev().click();
    }
});

Template.UserSettingsUpdateInformationForm.onRendered(function(){
    $("input[name='profile.hidden']").val("nothing");
})

Template.UserSettingsUpdateInformationForm.helpers({
    "infoMessage": function () {
        return pageSession.get("userSettingsUpdateInformationFormInfoMessage");
    },
    "errorMessage": function () {
        return pageSession.get("userSettingsUpdateInformationFormErrorMessage");
    },
    publicationList: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var pubs = Publications.find({visible:"1"}, {title: 1, titleCn: 1}).fetch();
        var result = [];
        _.each(pubs, function (item) {
            var title = iscn ? item.titleCn : item.title;
            result.push({label: title, value: item._id});
        });
        return result;
    },
    topicList: function () {
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var topics = Topics.find({},{name:1,englishName:1}).fetch();
        var result = [];
        _.each(topics,function(item){
            var name = iscn?item.name:item.englishName;
            result.push({label:name,value:item._id});
        });
        return result;
    },
    getUserProfileSchema:function(){
        return userSchema;
    }
});