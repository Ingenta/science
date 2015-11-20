//定义一个用户包权限管理对象
//new OrbitPermissions.Registrar(packageName) [anywhere]
topicPermissions = new Permissions.Registrar('topic');
//注册功能
//registrar.definePermission(permission_symbol, description) [anywhere]
topicPermissions
	.definePermission("add-topic", {
		en: {name: "add topic", summary: "can add topic"},
		cn: {name: "添加分类", summary: "您可以添加新分类到系统中"},
		options:{
			level:adminLevel
		}
	})
	.definePermission("modify-topic", {
		en: {name: "modify topic", summary: "can modify topic"},
		cn: {name: "编辑分类", summary: "可以编辑分类信息"},
		options:{
			level:adminLevel
		}
	})
	.definePermission("delete-topic", {
		en: {name: "delete topic", summary: "can delete topic"},
		cn: {name: "删除分类", summary: "您可以删除分类信息"},
		options:{
			level:adminLevel
		}
	})
    .definePermission("add-article-to-topic", {
        en: {name: "add article to topic", summary: "can add article to topic"},
        cn: {name: "为分类添加文章", summary: "您可以为分类添加文章"},
	    options:{
		    level:adminLevel
	    }
    });

// 定义预定义角色及其权限
// registrar.defineRole(role_name, permissions, description) [anywhere]
topicPermissions
	.defineRole("topic-manager", ["add-topic", "modify-topic", "delete-topic", "add-article-to-topic"], {
		en: {
			name   : "topic manager",
			summary: "manager for topic"
		},
		cn: {
			name   : "分类管理",
			summary: "可以增删改查分类的角色"
		},
		options:{
			level:adminLevel
		}
	});
