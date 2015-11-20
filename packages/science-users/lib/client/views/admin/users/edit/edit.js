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
                Router.go("admin.institutions.detail", {insId: Router.current().data().currUser.institutionId});
                //Session.set('activeTab', 'account');
            } else if(Router.current().route.getName() === "publisher.account.edit") {
                Router.go("publisher.account", {pubId: Router.current().data().currUser.publisherId});
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
                Permissions.check("modify-user","user");
                var roles = values.roles;
                delete values.roles;
                Meteor.call("updateUserAccount", Router.current().data().currUser._id, values, function (e) {
                    if (e) errorAction(e.message); else submitAction();
                });
                var rolesAtThisLevel = Permissions.getRolesDescriptions2(Router.current().data().currUser.level,false)
                var rolesForSet= _.map(roles,function(role){
                    var scope={};
                    if(values.publisherId) scope.publisher = [values.publisherId];
                    if(values.journalId) scope.journal=[values.journalId];
                    if(values.institutionId) scope.institution=[values.institutionId];
                    var r = rolesAtThisLevel[role];
                    if(!_.isEmpty(scope)){
                        return {"role":role,scope:scope};
                    }else{
                        return role;
                    }
                });
                !_.isEmpty(rolesForSet) && Permissions.setRoles(Router.current().data().currUser._id, rolesForSet, function (err) {
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
            Router.go("admin.institutions.detail", {insId: Router.current().data().currUser.institutionId});
            //Session.set('activeTab', 'account');
        } else if(Router.current().route.getName() === "publisher.account.edit") {
            Router.go("publisher.account", {pubId: Router.current().data().currUser.publisherId});
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
        return Router.current().data().currUser.disable ? "checked" : "";
    },
    "emailAddress": function () {
        return Router.current().data().currUser.emails[0].address;
    },
    "getInstitutionNameById": function () {
        return Institutions.findOne({_id: Router.current().data().currUser.institutionId}).name;
    },
    "getPublisherNameById": function () {
        return Publishers.findOne({_id: Router.current().data().currUser.publisherId}, {fields:{chinesename: 1, name: 1}});
    //},
    //"canEditRoles": function () {
    //    return "publisher" === Session.get("activeTab") || "admin" === Session.get("activeTab");
    },
    "getJournals": function () {
        return Publications.find({publisher: Router.current().data().currUser.publisherId}, {titleCn: 1, title: 1});
    },
    "setJournalId": function () {
        Session.set("journalId", Router.current().data().currUser.journalId);
    },
    "getJournalId": function () {
        return Session.get("journalId");
    },
    "isPublisherAdmin": function () {
        return _.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user") && Router.current().data().currUser._id !== Meteor.userId();
    }

});

Template.userEditRoles.helpers({
    "getRoles": function () {
        var user = Router.current().data().currUser;
        if(!user){
            console.error("Missing currUser!");
            return
        }
        var userLevel = [];
        user.publisherId && userLevel.push(OrbitPermissions.level.publisher);
        user.institutionId && userLevel.push(OrbitPermissions.level.institution);
        OrbitPermissions.isAdmin(user._id) && userLevel.push(OrbitPermissions.level.admin);
        return OrbitPermissions.getRolesDescriptions2(userLevel,true);
    },
    "roleInfo": function () {
        var info={
            code:this.name,
            name:this.description.name
        };
        var user = Router.current().data().currUser;
        var cu = Permissions.getUserRoles(user._id)
        if (cu) {
            var role = _.find(cu,function(c){
                return c===info.code || c.role===info.code;
            })
            if(role)
                info.checked="checked"
        }
        return info;
    }
});