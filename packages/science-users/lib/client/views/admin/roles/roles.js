Template.AdminRolesView.events({
    "click #dataview-insert-button":function(e){
        e.preventDefault();
        Router.go("admin.roles.insert", {});
    }
});

Template.RolesViewTable.helpers({
    "rolesKeys":function(prefix){
        if(Permissions.userCan("permissions-manager","permissions",Meteor.userId())){
            var roles = Permissions.getRolesDescriptions2();
            if(prefix){
                roles= _.filter(roles,function(role){
                    return role.name.indexOf(prefix) == 0;
                });
            }
            return roles;
        }
    },
    "pkgRolesKeys":function(){
        if(Permissions.userCan("permissions-manager","permissions",Meteor.userId())) {
            var roles = Permissions.getRolesDescriptions2();
            roles= _.filter(roles,function(role){
                return !(role.name.indexOf('permissions:') == 0 || role.name.indexOf('project-custom:') == 0)
            });
            return roles;
        }
    }
});

Template.DefinedRolesView.helpers({
    "levelName":function(){
        return TAPi18n.__("level."+this.toString())
    }
});

Template.CustomRoleView.helpers({
    "levelName":function(){
        return TAPi18n.__("level."+this.toString())
    },
    "customUserInfo":function(){
        return Permissions.custom_roles.findOne({_id:this.name.replace("project-custom:","")})
    }
})
Template.CustomRoleView.events({
    "click .fa-pencil": function (e) {
        Router.go("admin.roles.update", {"roleId": this._id});
    },
    "click .fa-trash" : function (e) {
        if(confirm("are you sure to delete the Role \"" + this.description.en.name + "\" ?")){
            Permissions.undefineCustomRoleAndRevoke(this._id,function(e){
                if(e){
                    alert(e);
                }
            });
        }
    },
    "click .fa-plus" : function(e){

        Router.go("admin.roles.choose.permissions",{"roleId": this._id});
    }
});
