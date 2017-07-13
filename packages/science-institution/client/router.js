Router.route("/admin/institutions/", {
    template: "Admin",
    name: "admin.institutions",
    parent: "admin",
    yieldTemplates: {
        'AdminInstitution': {to: 'AdminSubcontent'}
    },
    title: function () {
        return TAPi18n.__("Institution");
    },
    onBeforeAction:function(){
        Session.set("user-search-string-for-institution","");
        this.next();
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('institutions'),
            Meteor.subscribe("institutionsImage")
        ]
    }
});

Router.route("/admin/institutions/detail/:insId/", {
    template: "Admin",
    name: "admin.institutions.detail",
    parent: "admin.institutions",
    yieldTemplates: {
        'showInstitution': {to: 'AdminSubcontent'}
    },
    title: function () {
        return TAPi18n.__("Institution Detail");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('institutions'),
            Meteor.subscribe("institutionsImage")
        ]
    }
});

Router.route("/admin/institutions/detail/insert/:insId", {
    template: "Admin",
    name: "admin.institutions.detail.insert",
    parent: "admin.institutions.detail",
    title: function () {
        return TAPi18n.__("Add new user");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('institutions'),
        ]
    },
    controller: "AdminUsersInsertController",
});

Router.route("/admin/institutions/detail/edit/:userId", {
    template: "Admin",
    name: "admin.institutions.detail.edit",
    parent: "admin.institutions.detail",
    title: function () {
        return TAPi18n.__("Edit user");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('institutions'),
        ]
    },
    controller: "AdminUsersEditController",
});

Router.route("/institutionPanel/:insId", {
    name:"institutionPanel",
    controller: "InstitutionPanelController",
    parent: "home",
    title: function () {
        return TAPi18n.__("Institution");
    }
});

Router.route("/institution/detail/:insId/", {
    template: "InstitutionPanel",
    name: "institution.detail",
    parent: "institutionPanel",
    yieldTemplates: {
        'showInstitution': {to: 'InstitutionSubcontent'}
    },
    title: function () {
        return TAPi18n.__("Institution Detail");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('institutions'),
        ]
    },
    onBeforeAction: function () {
        Permissions.check("modify-institution", "institution", {institution: this.params.insId});
        /*BEFORE_FUNCTION*/
        this.next();
    },
    data: function () {
        return {
            scope: {institution: this.params.insId}
        };
    }
});