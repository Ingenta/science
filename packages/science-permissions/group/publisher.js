publisherPermissions = new Permissions.Registrar('publisher');

publisherPermissions
    .definePermission("add-publisher", {
        en: {name: "add publisher", summary: "can add publisher"},
        cn: {name: "添加出版商", summary: "您可以添加新出版商到系统中"}
    })
    .definePermission("modify-publisher", {
        en: {name: "modify publisher", summary: "can modify publisher"},
        cn: {name: "编辑出版商", summary: "可以编辑出版商信息"}
    })
    .definePermission("delete-publisher", {
        en: {name: "delete publisher", summary: "can delete publisher"},
        cn: {name: "删除出版商", summary: "您可以删除出版商信息"}
    })

    .definePermission("add-user", {
        en: {name: "add user", summary: "can add user"},
        cn: {name: "添加出版商用户", summary: "您可以添加新出版商用户到系统中"}
    })
    .definePermission("modify-user", {
        en: {name: "modify user", summary: "can modify user"},
        cn: {name: "编辑出版商用户", summary: "可以编辑出版商用户信息"}
    })

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
    })

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
    })

    .definePermission("add-advertisement", {
        en: {name: "add advertisement", summary: "can add advertisement"},
        cn: {name: "添加广告", summary: "您可以添加新广告到系统中"}
    })
    .definePermission("modify-advertisement", {
        en: {name: "modify advertisement", summary: "can modify advertisement"},
        cn: {name: "编辑广告", summary: "可以编辑广告信息"}
    })
    .definePermission("delete-advertisement", {
        en: {name: "delete advertisement", summary: "can delete advertisement"},
        cn: {name: "删除广告", summary: "您可以删除广告信息"}
    })
    .definePermission("publiser-collection", {
        en: {name: "publisher collection", summary: "manage publisher collection"},
        cn: {name: "出版商文章集（跨刊）", summary: "管理出版商文章集"}
    })
    .definePermission("journal-collection", {
        en: {name: "journal collection", summary: "manage journal collection"},
        cn: {name: "期刊文章集（同刊）", summary: "管理期刊文章集"}
    });

publisherPermissions
    .defineRole("publisher-manager-from-user", ["modify-publisher", "add-user", "modify-user","add-journal", "modify-journal", "delete-journal", "add-article", "modify-article", "delete-article", "add-advertisement", "modify-advertisement", "delete-advertisement", "publisher-collection", "journal-collection"], {
        en: {
            name: "publisher manager (publisher)",
            summary: "publisher manager"
        },
        cn: {
            name: "出版商管理员 (出版商)",
            summary: "只能修改出版社信息的角色"
        }
    });
