resourcePermissions = new Permissions.Registrar('resource');

resourcePermissions
	.definePermission("add-journal", {
		en: {name: "add journal", summary: "can add journal"},
		cn: {name: "添加期刊", summary: "您可以添加新期刊到系统中"}
	})
	.definePermission("modify-journal", {
		en: {name: "modify journal", summary: "can modify journal"},
		cn: {name: "编辑期刊", summary: "可以编辑期刊信息"}
	})
	.definePermission("delete-journal", {
		en: {name: "delete journal", summary: "can delete journal"},
		cn: {name: "删除期刊", summary: "您可以删除期刊信息"}
	});

resourcePermissions
	.definePermission("add-article", {
		en: {name: "add article", summary: "can add article"},
		cn: {name: "添加文章", summary: "您可以添加新文章到系统中"}
	})
	.definePermission("modify-article", {
		en: {name: "modify article", summary: "can modify article"},
		cn: {name: "编辑文章", summary: "可以编辑文章信息"}
	})
	.definePermission("delete-article", {
		en: {name: "delete article", summary: "can delete article"},
		cn: {name: "删除文章", summary: "您可以删除文章信息"}
	});

resourcePermissions
	.defineRole("journal-manager", ["add-journal", "modify-journal", "delete-journal",
		"add-article", "modify-article", "delete-article"], {
		en: {
			name   : "journal manager",
			summary: "manager for journal"
		},
		cn: {
			name   : "期刊管理",
			summary: "可以增删改期刊信息的角色"
		}
	});
