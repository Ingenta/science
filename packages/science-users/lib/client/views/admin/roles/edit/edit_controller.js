this.AdminRolesEditController = RouteController.extend({
    template: "Admin",


    yieldTemplates: {
        'AdminRoleEdit': { to: 'AdminSubcontent'}

    },

    onBeforeAction: function() {
        /*BEFORE_FUNCTION*/
        this.next();
    },

    action: function() {
        if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
        /*ACTION_FUNCTION*/
    },

    isReady: function() {


        var subs = [
            Meteor.subscribe("admin_user", this.params.userId)
        ];
        var ready = true;
        _.each(subs, function(sub) {
            if(!sub.ready())
                ready = false;
        });
        return ready;
    },

    data: function() {


        return {
            params: this.params || {},
            admin_role: Meteor.roles.findOne({_id:this.params.roleId}, {})
        };
        /*DATA_FUNCTION*/
    },

    onAfterAction: function() {
    }
});