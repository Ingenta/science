Template.AdminRolesView.events({
    "click #dataview-insert-button":function(e){
        e.preventDefault();
        Router.go("admin.roles.insert", {});
    }
});

Template.RolesViewTable.helpers({
    "rolesKeys":function(prefix){
        if(Permissions.userCan("permissions-manager","permissions",Meteor.userId())){
            var keys = Object.keys(Permissions.getRoles());
            if(prefix){
                keys= _.filter(keys,function(str){
                    return str.indexOf(prefix) == 0;
                });
            }
            return keys;
        }
    },
    "pkgRolesKeys":function(){
        if(Permissions.userCan("permissions-manager","permissions",Meteor.userId())) {
            var keys = Object.keys(Permissions.getRoles());
            keys= _.filter(keys,function(str){
                return !(str.indexOf('permissions:') == 0 || str.indexOf('project-custom:') == 0)
            });
            return keys;
        }
    }
});

Template.DefinedRolesView.helpers({
    "rolesDescription":function(key){
        if(key){
            return Permissions.getRolesDescriptions()[key];
        }
    }
});

Template.CustomRoleView.events({
    "click .fa-pencil": function (e) {
        Router.go("admin.roles.update", {"roleName": this.name});
    },
    "click .fa-trash" : function (e) {
        Permissions.undefineCustomRole(this.shortName,function(e){
            if(e){
                alert(e);
            }
        });
    },
    "click .fa-plus" : function(e){
        Router.go("admin.roles.choose.permissions",{"roleName": this.name});
    }
});

Template.CustomRoleView.helpers({
    "customRolesInfo":function(){
        return Permissions.getCustomRoles();
    }
});
