//定义一个用户包权限管理对象
//new OrbitPermissions.Registrar(packageName) [anywhere]
userPermissions = new Permissions.Registrar('user');
//注册功能
//registrar.definePermission(permission_symbol, description) [anywhere]
userPermissions
	.definePermission("add-user", {
		en: {name: "add user", summary: "can add user"},
		cn: {name: "添加用户", summary: "您可以添加新用户到系统中"}
	})
	.definePermission("modify-user", {
		en: {name: "modify user", summary: "can modify user"},
		cn: {name: "编辑用户", summary: "可以编辑用户信息"}
	})
	.definePermission("delete-user", {
		en: {name: "delete user", summary: "can delete user"},
		cn: {name: "删除用户", summary: "您可以删除用户信息"}
	})
	.definePermission("list-user", {
		en: {name: "list users", summary: "view users list"},
		cn: {name: "用户列表", summary: "您可以查看用户列表"}
	});

// 定义预定义角色及其权限
// registrar.defineRole(role_name, permissions, description) [anywhere]
userPermissions
	.defineRole("user-manager", ["add-user", "modify-user", "delete-user", "list-user"], {
		en: {
			name   : "user manager",
			summary: "manager for user"
		},
		cn: {
			name   : "用户管理",
			summary: "可以增删改查用户的角色"
		}
	});
