var pageSession = new ReactiveDict();

Template.AdminUsersInsert.rendered = function () {
    pageSession.set("adminUsersInsertInsertFormInfoMessage", "");
    pageSession.set("adminUsersInsertInsertFormErrorMessage", "");
    $("input[autofocus]").focus();
};

Template.AdminUsersInsert.events({
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
            } else if (Router.current().route.getName() === "publisher.account.insert") {
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
                Permissions.check("add-user", "user");
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
        } else if (Router.current().route.getName() === "publisher.account.insert") {
            Router.go("publisher.account", {pubId: Router.current().params.pubId});
        } else {
            Router.go("admin.users", {});
        }
    },
    "change #form-select-publisher": function (e) {
        e.preventDefault();
        Session.set("publisherId", $(e.target).val());
    }

});

Template.AdminUsersInsert.helpers({
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
    "isPublisherAdmin": function () {
        return "publisher.account.insert" === Router.current().route.getName();
    },
    "getInstitutions": function () {
        return Institutions.find({}, {fields:{name: 1}});
    },
    "getPublishers": function () {
        return Publishers.find({}, {fields:{chinesename: 1, name: 1}});
    },
    "getJournals": function () {
        return Publications.find({publisher: Session.get("publisherId")}, {fields:{titleCn: 1, title: 1}});
    }

});
