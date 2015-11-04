platformPermissions = new Permissions.Registrar('platform');

platformPermissions
    .definePermission("manage-top-most-read", {
        en: {name: "manage top most read", summary: "manage top most read on homepage"},
        cn: {name: "管理最多阅读置顶", summary: "可管理首页最多阅读置顶"}
    });
