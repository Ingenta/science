platformPermissions = new Permissions.Registrar('platform');

platformPermissions
    .definePermission("manage-top-most-read", {
        en: {name: "manage top most read", summary: "manage top most read on homepage"},
        cn: {name: "管理最多阅读置顶", summary: "可管理首页最多阅读置顶"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("edit-page-description", {
        en: {name: "edit page description", summary: "edit all page description"},
        cn: {name: "修改页面描述", summary: "修改平台各页面功能介绍描述"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("use-admin-panel", {
        en: {name: "access to admin panel", summary: "access to admin panel"},
        cn: {name: "使用系统管理页面", summary: "使用系统管理页面"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("use-institution-panel", {
        en: {name: "access to institution panel", summary: "access to institution panel"},
        cn: {name: "使用机构管理页面", summary: "使用机构管理页面"},
        options: {
            level: institutionLevel
        }
    })
    .definePermission("use-publisher-panel", {
        en: {name: "access to publisher panel", summary: "access to publisher panel"},
        cn: {name: "使用出版商管理页面", summary: "使用出版商管理页面"},
        options: {
            level: publisherLevel
        }
    });
