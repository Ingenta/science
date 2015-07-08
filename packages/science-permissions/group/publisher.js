publisherPermissions = new Permissions.Registrar('publisher');

publisherPermissions
	.definePermission("add-publisher", {
		en: {name: "add publisher", summary: "can add publisher"},
		cn: {name: "添加出版社", summary: "您可以添加新出版社到系统中"}
	})
	.definePermission("modify-publisher", {
		en: {name: "modify publisher", summary: "can modify publisher"},
		cn: {name: "编辑出版社", summary: "可以编辑出版社信息"}
	})
	.definePermission("delete-publisher", {
		en: {name: "delte publisher", summary: "can delte publisher"},
		cn: {name: "删除出版社", summary: "您可以删除出版社信息"}
	});

publisherPermissions
	.defineRole("publisher-manager", ["add-publisher", "modify-publisher", "delete-publisher"], {
		en: {
			name   : "publisher manager",
			summary: "manager for publisher"
		},
		cn: {
			name   : "出版社管理",
			summary: "可以增删改出版社信息的角色"
		}
	});
