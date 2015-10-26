var pageSession = new ReactiveDict();

Template.AdminUsersEdit.rendered = function () {

};

Template.AdminUsersEdit.events({});

Template.AdminUsersEdit.helpers({});

Template.AdminUsersEditEditForm.rendered = function () {

    pageSession.set("adminUsersEditEditFormInfoMessage", "");
    pageSession.set("adminUsersEditEditFormErrorMessage", "");

    $(".input-group.date").each(function () {
        var format = $(this).find("input[type='text']").attr("data-format");

        if (format) {
            format = format.toLowerCase();
        }
        else {
            format = "mm/dd/yyyy";
        }

        $(this).datepicker({
            autoclose: true,
            todayHighlight: true,
            todayBtn: true,
            forceParse: false,
            keyboardNavigation: false,
            format: format
        });
    });

    $("input[autofocus]").focus();
};

Template.AdminUsersEditEditForm.events({
    "submit": function (e, t) {
        e.preventDefault();
        pageSession.set("adminUsersEditEditFormInfoMessage", "");
        pageSession.set("adminUsersEditEditFormErrorMessage", "");

        var that = this;

        function submitAction(msg) {
            var adminUsersEditEditFormMode = "update";
            if (!t.find("#form-cancel-button")) {
                switch (adminUsersEditEditFormMode) {
                    case "insert":
                    {
                        $(e.target)[0].reset();
                    }
                        ;
                        break;

                    case "update":
                    {
                        var message = msg || TAPi18n.__("Saved");
                        pageSession.set("adminUsersEditEditFormInfoMessage", message);
                    }
                        ;
                        break;
                }
            }
            if (Router.current().route.getName() === "admin.institutions.detail.edit") {
                //history.back();
                Router.go("admin.institutions.detail", {insId: that.admin_user.institutionId});
                //Session.set('activeTab', 'account');
            } else if(Router.current().route.getName() === "publisher.account.edit") {
                Router.go("publisher.account", {pubId: that.admin_user.publisherId});
            } else {
                Router.go("admin.users", {});
            }
        }

        function errorAction(msg) {
            var message = msg || "Error.";
            pageSession.set("adminUsersEditEditFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function (fieldName, fieldValue) {

            },
            function (msg) {

            },
            function (values) {
                Permissions.check("modify-user","publisher");
                var roles = values.roles;
                delete values.roles;
                Meteor.call("updateUserAccount", t.data.admin_user._id, values, function (e) {
                    if (e) errorAction(e.message); else submitAction();
                });
                var allRoles = Object.keys(Permissions.getRoles());
                var revokeRoles = _.difference(allRoles, roles);//从所有角色中去掉需要设置的角色，即为需要取消的角色
                !_.isEmpty(revokeRoles) && Permissions.revoke(t.data.admin_user._id, revokeRoles);
                !_.isEmpty(roles) && Permissions.delegate(t.data.admin_user._id, roles, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        );

        return false;
    },
    "click #form-cancel-button": function (e, t) {
        e.preventDefault();
        if (Router.current().route.getName() === "admin.institutions.detail.edit") {
            //history.back();
            Router.go("admin.institutions.detail", {insId: this.admin_user.institutionId});
            //Session.set('activeTab', 'account');
        } else if(Router.current().route.getName() === "publisher.account.edit") {
            Router.go("publisher.account", {pubId: this.admin_user.publisherId});
        } else {
            Router.go("admin.users", {});
        }
    },
    "click #form-close-button": function (e, t) {
        e.preventDefault();

        /*CLOSE_REDIRECT*/
    },
    "click #form-back-button": function (e, t) {
        e.preventDefault();

        /*BACK_REDIRECT*/
    }


});

Template.AdminUsersEditEditForm.helpers({
    "infoMessage": function () {
        return pageSession.get("adminUsersEditEditFormInfoMessage");
    },
    "errorMessage": function () {
        return pageSession.get("adminUsersEditEditFormErrorMessage");
    },
    "disableStatus": function () {
        return this.admin_user.disable ? "checked" : "";
    },
    "emailAddress": function () {
        return this.admin_user.emails[0].address;
    },
    "getInstitutionNameById": function () {
        return Institutions.findOne({_id: this.admin_user.institutionId}).name;
    },
    "getPublisherNameById": function () {
        return Publishers.findOne({_id: this.admin_user.publisherId}, {chinesename: 1, name: 1});
    },
    "canEditRoles": function () {
        return "publisher" === Session.get("activeTab") || "admin" === Session.get("activeTab");
    },
    "getJournals": function () {
        return Publications.find({publisher: this.admin_user.publisherId}, {titleCn: 1, title: 1});
    },
    "setJournalId": function () {
        Session.set("journalId", this.admin_user.journalId);
    },
    "getJournalId": function () {
        return Session.get("journalId");
    },
    "isPublisherAdmin": function () {
        //console.log(Permissions.getUserRoles());
        return _.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user") && this.admin_user._id !== Meteor.userId();
    }

});

Template.userEditRoles.helpers({
    "usersRoles": function () {
        var user = Meteor.users.findOne({_id: Router.current().params.userId});
        Session.set("curUser", user);
        var pr = {};
        if("admin" === Session.get("activeTab"))
            pr = Permissions.getRoles();
        if("publisher" === Session.get("activeTab")){
            var temp = Permissions.getRoles();
            if(Permissions.isAdmin()){
                pr["permissions:permissions-manager"] = temp["permissions:permissions-manager"];
                pr["publisher:publisher-manager-from-user"] = temp["publisher:publisher-manager-from-user"];
            };
            var keys = ["resource:journal-manager", "news:news-manager", "advertisement:advertisement-manager"];//出版商管理员可设置的权限
            keys.forEach(function (key) {
                pr[key] = temp[key];
            });
        }
        return Object.keys(pr);
    },
    "itemIsChecked": function () {
        var cu = Session.get("curUser").orbit_roles;

        if (cu) {
            return cu.indexOf(this.toString()) > -1 ? "checked" : "";
        }
        return "";
    },
    "i18nName": function () {
        return Permissions.getRoleDescByCode(this).name;
    },
    "itemIsDisabled": function () {
        return Permissions.userCan("delegate-and-revoke", "permissions", Meteor.userId()) ? "" : "disabled";
    //},
    //"radioOrCheckbox": function () {
    //    if("admin" === Session.get("activeTab"))
    //        return "checkbox";
    //    if("publisher" === Session.get("activeTab"))
    //        return "radio";
    }
});