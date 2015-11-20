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
                var urlQuery=Router.current().params.query;
                if(urlQuery){

                    if(urlQuery.level)
                        values.level=urlQuery.level;

                    if(urlQuery.institutionId)
                        values.institutionId=urlQuery.institutionId;

                    if(values.level==='institution' && !values.institutionId){
                        errorAction("Missing institution id");
                        return false;
                    }
                }
                var level=Router.current().params.query && Router.current().params.query.level;
                values.level=level || "normal";
                Meteor.call("createUserAccount", values, function (e, userId) {
                    if (e) {
                        errorAction(e.message);
                    }else{
                        if (values.level === "admin")
                            Permissions.setRoles(userId, ["permissions:admin"]);
                        if (values.level === 'publisher' && values.publisherId)
                            Permissions.setRoles(userId,[{"role":"publisher:publisher-manager-from-user",scope:{publisher:[values.publisherId]}}])
                        if (values.level === 'institution' && values.institutionId)
                            Permissions.setRoles(userId,[{"role":"institution:institution-manager-from-user",scope:{institution:[values.institutionId]}}]);
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
