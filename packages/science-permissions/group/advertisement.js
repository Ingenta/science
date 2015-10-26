advertisementPermissions = new Permissions.Registrar('advertisement');

advertisementPermissions
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
    });

advertisementPermissions
    .defineRole("advertisement-manager", ["add-advertisement", "modify-advertisement", "delete-advertisement"], {
        en: {
            name: "advertisement manager (publisher)",
            summary: "advertisement manager"
        },
        cn: {
            name: "广告编辑 (出版商)",
            summary: "广告编辑"
        }
    });
