this.AdminUsersEditController = RouteController.extend({
    template: "Admin",


    yieldTemplates: {
        'AdminUsersEdit': {to: 'AdminSubcontent'}

    },

    onBeforeAction: function () {
        var scope = {};
        var user = Users.findOne({_id: this.params.userId}, {fields: {publisherId: 1, institutionId: 1}});
        if (user && user.publisherId)
            scope.publisher = user.publisherId;
        if (user && user.institutionId)
            scope.institution = user.institutionId;
        if (!Permissions.userCan("modify-user", "user", Meteor.userId(), scope))
            Router.go("home");
        this.next();
    },

    data: function () {
        return {
            params: this.params || {},
            currUser: Users.findOne({_id: this.params.userId}, {})
        };
        /*DATA_FUNCTION*/
    }
});