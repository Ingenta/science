advertisementPermissions = new Permissions.Registrar('advertisement');

advertisementPermissions
    .definePermission("add-global-advertisement", {
        en: {name: "add global　advertisement", summary: "can add global　advertisement"},
        cn: {name: "添加平台广告", summary: "您可以添加新平台广告到系统中"}
    })
    .definePermission("modify-global-advertisement", {
        en: {name: "modify　global advertisement", summary: "can modify global　advertisement"},
        cn: {name: "编辑平台广告", summary: "可以编辑平台广告信息"}
    })
    .definePermission("delete-global-advertisement", {
        en: {name: "delete global　advertisement", summary: "can delete global　advertisement"},
        cn: {name: "删除平台广告", summary: "您可以删除平台广告信息"}
    })

    .definePermission("add-journal-advertisement", {
        en: {name: "add journal　advertisement", summary: "can add journal　advertisement"},
        cn: {name: "添加期刊主页广告", summary: "您可以添加新期刊主页广告到系统中"}
    })
    .definePermission("modify-journal-advertisement", {
        en: {name: "modify　journal advertisement", summary: "can modify journal　advertisement"},
        cn: {name: "编辑期刊主页广告", summary: "可以编辑期刊主页广告信息"}
    })
    .definePermission("delete-journal-advertisement", {
        en: {name: "delete journal　advertisement", summary: "can delete journal　advertisement"},
        cn: {name: "删除期刊主页广告", summary: "您可以删除期刊主页广告信息"}
    });

advertisementPermissions
    .defineRole("advertisement-manager-publisher", ["add-journal-advertisement", "modify-journal-advertisement", "delete-journal-advertisement"], {
        en: {
            name: "advertisement manager (publisher)",
            summary: "advertisement manager"
        },
        cn: {
            name: "广告编辑 (出版商)",
            summary: "广告编辑"
        }
    });
