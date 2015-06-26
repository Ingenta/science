Meteor.roles = new Meteor.Collection("roles");

Roles={};
//TODO: 角色列表

var validateListRolesHook=[];

Roles.listRoles=function(){
    _.each(validateListRolesHook,function(hook){
        if(!hook(role))
            throw new Meteor.Error(403,"List Role validation failed");
    });
    try{
        return Meteor.roles.find();
    }catch(e){
        throw e;
    }
};

/**
 * 设置查询角色列表信息前的检查条件
 * @param func
 */
Roles.validateListRoles=function(func){
    validateListRolesHook.push(func);
};
