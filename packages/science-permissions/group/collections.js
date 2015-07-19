collPermissions = new Permissions.Registrar('collections');

collPermissions
	.definePermission("add-publisher-collections", {
		en: {name: "create big collections", summary: "can create cross journal collection "},
		cn: {name: "创建跨刊文章集", summary: "可以创建文章选自同一出版社的文章集"}
	})
	.definePermission("modify-publisher-collections", {
		en: {name: "Modify big collections", summary: "can Modify cross journal collection "},
		cn: {name: "修改跨刊文章集", summary: "可以修改文章选自同一出版社的文章集"}
	})
	.definePermission("del-publisher-collections", {
		en: {name: "delete big collections", summary: "can Delete cross journal collection "},
		cn: {name: "删除跨刊文章集", summary: "可以删除文章选自同一出版社的文章集"}
	});

collPermissions
	.defineRole("collections-manager", ["add-publisher-collections", "modify-publisher-collections", "delete-publisher-collections"], {
		en: {
			name   : "publisher level collections manager",
			summary: "manager for publisher’s collections"
		},
		cn: {
			name   : "出版社级文章集管理员",
			summary: "可以增删改出版社级文章集的角色"
		}
	});
