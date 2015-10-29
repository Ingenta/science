collPermissions = new Permissions.Registrar('collections');

collPermissions
	//平台文章集
	.definePermission("add-big-collections", {
		en: {name: "create big collections", summary: "can create big collection "},
		cn: {name: "创建大文章集", summary: "可以创建文章选自同一出版社的大文章集"}
	})
	.definePermission("modify-big-collections", {
		en: {name: "Modify big collections", summary: "can Modify big collection "},
		cn: {name: "修改大文章集", summary: "可以修改文章选自同一出版社的大文章集"}
	})
	.definePermission("del-big-collections", {
		en: {name: "delete big collections", summary: "can Delete big collection "},
		cn: {name: "删除大文章集", summary: "可以删除文章选自同一出版社的大文章集"}
	})
	.definePermission("add-article-big-collections", {
		en: {name: "add article to big collections", summary: "can Add article to big collection "},
		cn: {name: "添加文章到大文章集", summary: "添加文章到大文章集"}
	})
	.definePermission("remove-article-big-collections", {
		en: {name: "remove article from big collections", summary: "can Remove article from big collection "},
		cn: {name: "从大文章集移除文章", summary: "从大文章集移除文章"}
	})
	//跨刊文章集
	.definePermission("add-publisher-collections", {
		en: {name: "create publisher collections", summary: "can create cross journal collection "},
		cn: {name: "创建跨刊文章集", summary: "可以创建文章选自同一出版社的文章集"}
	})
	.definePermission("modify-publisher-collections", {
		en: {name: "Modify publisher collections", summary: "can Modify cross journal collection "},
		cn: {name: "修改跨刊文章集", summary: "可以修改文章选自同一出版社的文章集"}
	})
	.definePermission("del-publisher-collections", {
		en: {name: "delete publisher collections", summary: "can Delete cross journal collection "},
		cn: {name: "删除跨刊文章集", summary: "可以删除文章选自同一出版社的文章集"}
	})
	.definePermission("add-article-publisher-collections", {
		en: {name: "add article to publisher collections", summary: "can Add article to cross journal collection "},
		cn: {name: "添加文章到跨刊文章集", summary: "添加文章到跨刊文章集"}
	})
	.definePermission("remove-article-publisher-collections", {
		en: {name: "remove article from publisher collections", summary: "can Remove article from cross journal collection "},
		cn: {name: "从跨刊文章集移除文章", summary: "从跨刊文章集移除文章"}
	})
	//期刊文章集
	.definePermission("add-journal-collections", {
		en: {name: "create big collections", summary: "can create single journal collection "},
		cn: {name: "创建期刊文章集", summary: "可以创建文章选自同一期刊的文章集"}
	})
	.definePermission("modify-journal-collections", {
		en: {name: "Modify big collections", summary: "can Modify single journal collection "},
		cn: {name: "修改期刊文章集", summary: "可以修改文章选自同一期刊的文章集"}
	})
	.definePermission("del-journal-collections", {
		en: {name: "delete big collections", summary: "can Delete single journal collection "},
		cn: {name: "删除期刊文章集", summary: "可以删除文章选自同一期刊的文章集"}
	})
	.definePermission("add-article-journal-collections", {
		en: {name: "add article to journal collections", summary: "can Add article to single journal collection "},
		cn: {name: "添加文章到期刊文章集", summary: "添加文章到期刊文章集"}
	})
	.definePermission("remove-article-journal-collections", {
		en: {name: "remove article from journal collections", summary: "can Remove article from single journal collection "},
		cn: {name: "从期刊文章集移除文章", summary: "从期刊文章集移除文章"}
	});

//collPermissions
//	.defineRole("collections-manager", ["add-publisher-collections", "modify-publisher-collections", "delete-publisher-collections"], {
//		en: {
//			name   : "publisher level collections manager",
//			summary: "manager for publisher’s collections"
//		},
//		cn: {
//			name   : "出版社级文章集管理员",
//			summary: "可以增删改出版社级文章集的角色"
//		}
//	});
