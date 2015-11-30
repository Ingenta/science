newsPermissions = new Permissions.Registrar('news');

newsPermissions
    .definePermission("add-homepage-news", {
        en: {name: "add homepage news", summary: "add homepage news"},
        cn: {name: "新建首页新闻", summary: "新建首页新闻"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("edit-homepage-news", {
        en: {name: "edit homepage news", summary: "edit homepage news"},
        cn: {name: "修改新闻管理", summary: "修改首页新闻"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("delete-homepage-news", {
        en: {name: "delete homepage news", summary: "delete homepage news"},
        cn: {name: "删除首页新闻", summary: "删除首页新闻"},
        options: {
            level: adminLevel
        }
    });

newsPermissions
    .defineRole("news-manager", ["add-homepage-news", "edit-homepage-news", "delete-homepage-news"], {
        en: {
            name: "news manager",
            summary: "manager for news"
        },
        cn: {
            name: "新闻管理",
            summary: "可以增删改新闻信息的角色"
        },
        options: {
            level: adminLevel
        }
    });
