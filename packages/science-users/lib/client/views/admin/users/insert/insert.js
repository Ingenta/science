var pageSession = new ReactiveDict();

Template.AdminUsersInsert.rendered = function () {

};
Template.AdminUsersInsert.onRendered( function () {
    Session.set("publisherId", "");
});
Template.AdminUsersInsert.events({});

Template.AdminUsersInsert.helpers({});

Template.AdminUsersInsertInsertForm.rendered = function () {


    pageSession.set("adminUsersInsertInsertFormInfoMessage", "");
    pageSession.set("adminUsersInsertInsertFormErrorMessage", "");

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

Template.AdminUsersInsertInsertForm.events({
    "submit": function (e, t) {
        e.preventDefault();
        pageSession.set("adminUsersInsertInsertFormInfoMessage", "");
        pageSession.set("adminUsersInsertInsertFormErrorMessage", "");

        var self = this;

        function submitAction(msg) {
            var adminUsersInsertInsertFormMode = "insert";
            if (!t.find("#form-cancel-button")) {
                switch (adminUsersInsertInsertFormMode) {
                    case "insert":
                    {
                        $(e.target)[0].reset();
                    }
                        ;
                        break;

                    case "update":
                    {
                        var message = msg || TAPi18n.__("Saved");
                        pageSession.set("adminUsersInsertInsertFormInfoMessage", message);
                    }
                        ;
                        break;
                }
            }

            if (Router.current().route.getName() === "admin.institutions.detail.insert") {
                //history.back();
                Router.go("admin.institutions.detail", {insId: Router.current().params.insId});
                //Session.set('activeTab', 'account');
            } else if(Router.current().route.getName() === "publisher.account.insert") {
                Router.go("publisher.account", {pubId: Router.current().params.pubId});
            } else {
                Router.go("admin.users", {});
            }
        }

        function errorAction(msg) {
            var message = msg || "Error.";
            pageSession.set("adminUsersInsertInsertFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function (fieldName, fieldValue) {

            },
            function (msg) {

            },
            function (values) {
                Permissions.check("add-user", "publisher");
                if (Router.current().params.insId) values.institutionId = Router.current().params.insId;//机构帐号标签页才需要设值
                Meteor.call("createUserAccount", values, function (e, userId) {
                    if (e) {
                        errorAction(e.message);
                    }
                    else {
                        if (Session.get("activeTab") === "admin") Permissions.delegate(userId, ["permissions:admin"]);
                        if (values.institutionId) {
                            Permissions.delegate(userId, ["institution:institution-manager-from-user"]);
                        }

                        submitAction();
                    }
                });
            }
        );

        return false;
    },
    "click #form-cancel-button": function (e, t) {
        e.preventDefault();

        if (Router.current().route.getName() === "admin.institutions.detail.insert") {
            //history.back();
            Router.go("admin.institutions.detail", {insId: Router.current().params.insId});
            //Session.set('activeTab', 'account');
        } else if(Router.current().route.getName() === "publisher.account.insert") {
            Router.go("publisher.account", {pubId: Router.current().params.pubId});
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
    },
    "change #form-select-publisher": function (e) {
        e.preventDefault();
        Session.set("publisherId",$(e.target).val());
    }

});

Template.AdminUsersInsertInsertForm.helpers({
    "infoMessage": function () {
        return pageSession.get("adminUsersInsertInsertFormInfoMessage");
    },
    "errorMessage": function () {
        return pageSession.get("adminUsersInsertInsertFormErrorMessage");
    },
    "isInstitution": function () {
        return "institution" === Session.get("activeTab");
    },
    "isPublisher": function () {
        return "publisher" === Session.get("activeTab");
    },
    "getInstitutions": function () {
        return Institutions.find({}, {name: 1});
    },
    "getPublishers": function () {
        return Publishers.find({}, {chinesename: 1, name: 1});
    },
    "getJournals": function () {
        return Publications.find({publisher: Session.get("publisherId")}, {titleCn: 1, title: 1});
    }

});
