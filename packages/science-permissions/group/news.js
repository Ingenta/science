newsPermissions = new Permissions.Registrar('news');

newsPermissions
	.definePermission("manager-homepage", {
		en: {name: "homepage news manager", summary: "manager news of homepage"},
		cn: {name: "首页新闻管理", summary: "可管理出现在首页上的新闻"}
	});

publisherPermissions
	.defineRole("news-manager", ["add-publisher", "modify-publisher", "delete-publisher"], {
		en: {
			name   : "news manager",
			summary: "manager for news"
		},
		cn: {
			name   : "新闻管理",
			summary: "可以增删改新闻信息的角色"
		}
	});
