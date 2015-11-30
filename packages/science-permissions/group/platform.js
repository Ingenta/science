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
    });
