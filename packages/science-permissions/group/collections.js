collPermissions = new Permissions.Registrar('collections');

collPermissions
    //跨刊文章集
    .definePermission("add-publisher-collection", {
        en: {name: "create publisher collection", summary: "can create cross journal collection "},
        cn: {name: "创建跨刊文章集", summary: "可以创建文章选自同一出版社的文章集"},
        options:{
            level:publisherLevel
        }
    })
    .definePermission("modify-publisher-collection", {
        en: {name: "Modify publisher collection", summary: "can Modify cross journal collection "},
        cn: {name: "修改跨刊文章集", summary: "可以修改文章选自同一出版社的文章集"},
        options:{
            level:publisherLevel
        }
    })
    .definePermission("del-publisher-collection", {
        en: {name: "delete publisher collection", summary: "can Delete cross journal collection "},
        cn: {name: "删除跨刊文章集", summary: "可以删除文章选自同一出版社的文章集"},
        options:{
            level:publisherLevel
        }
    })
    //期刊文章集
    .definePermission("add-journal-collection", {
        en: {name: "create journal collection", summary: "can create single journal collection "},
        cn: {name: "创建期刊文章集", summary: "可以创建文章选自同一期刊的文章集"},
        options:{
            level:journalLevel
        }
    })
    .definePermission("modify-journal-collection", {
        en: {name: "Modify journal collection", summary: "can Modify single journal collection "},
        cn: {name: "修改期刊文章集", summary: "可以修改文章选自同一期刊的文章集"},
        options:{
            level:journalLevel
        }
    })
    .definePermission("del-journal-collection", {
        en: {name: "delete journal collection", summary: "can Delete single journal collection "},
        cn: {name: "删除期刊文章集", summary: "可以删除文章选自同一期刊的文章集"},
        options:{
            level:journalLevel
        }
    });
collPermissions
	.defineRole("publisher-collections-manager", ["add-publisher-collections", "modify-publisher-collections", "delete-publisher-collections"], {
		en: {
			name   : "publisher level collections manager",
			summary: "manager for publisher’s collections"
		},
		cn: {
			name   : "出版社级文章集管理员",
			summary: "可以增删改出版社级文章集的角色"
		},options:{
            level:publisherLevel
        }
	})
    .defineRole("journal-collections-manager", ["add-journal-collections", "modify-journal-collections", "delete-journal-collections"], {
        en: {
            name   : "journal level collections manager",
            summary: "manager for journal’s collections"
        },
        cn: {
            name   : "期刊级文章集管理员",
            summary: "可以增删改期刊级文章集的角色"
        },options:{
            level:publisherLevel
        }
    });