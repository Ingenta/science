
//TODO: 创建角色
var onCreateRoleHook = null;
var validateNewRoleHooks= [];

Roles.onCreateRole=function(func){
    if(onCreateRoleHook)
        throw new Error("Can only call onCreateRole once");
    else
        onCreateRoleHook = func;
};

Roles.createRole = function(role){
    role = _.extend({createdAt: new Date(), _id: Random.id()},role);
    if(onCreateRoleHook){
        onCreateRoleHook(role);
    }
    _.each(validateNewRoleHooks,function(hook){
        if(!hook(role))
            throw new Meteor.Error(403,"Role validation failed");
    });
    var roleId;
    try{
        roleId = Meteor.roles.insert(role);
    }catch(e){
        throw e;
    }
    return roleId;
};
/**
 * 设置创建新角色要进行的验证方法。
 * @param func
 */
Roles.validateNewRole = function(func){
    validateNewRoleHooks.push(func);
};
/**
 * 检查角色名称是否合法
 */
Roles.validateNewRole(function(role){
    if(!role)
        return false;//未传入role
    if(_.isEmpty(role.name))
        return false;//角色名称为空
    var isRoleNameExists=Meteor.roles.findOne({name:role.name});
    if(isRoleNameExists)
        return false;//角色名称已存在
    return true;
});


//TODO: 角色列表

Meteor.publish('roles',function(){
    return Meteor.roles.find();
});

//TODO: 修改用户的角色信息

//TODO: 修改角色名称
Roles.updateRole=function(id,role){

    if(role.updateAt){
        role.updateAt=new Date();
    }else{
        _.extend({"updateAt":new Date()},role);
    }


    try{
        Meteor.roles.update({_id:id},{$set:{'name':role.name}});
    }catch(e){
        throw e;
    }
    return true;
}
//TODO: 删除角色
//TODO: 查询角色下所有用户
