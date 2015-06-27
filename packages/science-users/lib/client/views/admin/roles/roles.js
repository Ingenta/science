Template.AdminRolesView.helpers({
    "isNotEmpty":function(){
        return Meteor.roles.findOne();
    }
});

Template.AdminRolesView.events({
    "click #dataview-insert-button":function(e){
        e.preventDefault();
        Router.go("admin.roles.insert", {});
    }
});

Template.RolesViewTable.helpers({
    "tableItems":function(){
        return Roles.listRoles();
    }
});

Template.RolesViewTableItems.events({
    "click .fa-pencil":function(e){
        e.preventDefault();
        Router.go("admin.roles.update",{"roleId":this._id});
    },
    "click .fa-trash":function(e){
        e.preventDefault();
        Meteor.call('deleteRole',this._id,function(e){
            if(e){
                console.log(e)
            }
        })
    }
})