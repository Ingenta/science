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
        cn: {name: "修改首页新闻", summary: "修改首页新闻"},
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
    })
    //.definePermission("add-publisher-news", {
    //    en: {name: "add publisher news", summary: "add publisher news"},
    //    cn: {name: "新建出版商新闻", summary: "新建出版商新闻"},
    //    options: {
    //        level: publisherLevel
    //    }
    //})
    //.definePermission("edit-publisher-news", {
    //    en: {name: "edit publisher news", summary: "edit publisher news"},
    //    cn: {name: "修改出版商新闻", summary: "修改出版商新闻"},
    //    options: {
    //        level: publisherLevel
    //    }
    //})
    //.definePermission("delete-publisher-news", {
    //    en: {name: "delete publisher news", summary: "delete publisher news"},
    //    cn: {name: "删除出版商新闻", summary: "删除出版商新闻"},
    //    options: {
    //        level: publisherLevel
    //    }
    //})
    .definePermission("add-journal-news", {
        en: {name: "add journal news", summary: "add journal news"},
        cn: {name: "新建期刊新闻", summary: "新建期刊新闻"},
        options: {
            level: journalLevel
        }
    })
    .definePermission("edit-journal-news", {
        en: {name: "edit journal news", summary: "edit journal news"},
        cn: {name: "修改期刊新闻", summary: "修改期刊新闻"},
        options: {
            level: journalLevel
        }
    })
    .definePermission("delete-journal-news", {
        en: {name: "delete journal news", summary: "delete journal news"},
        cn: {name: "删除期刊新闻", summary: "删除期刊新闻"},
        options: {
            level: journalLevel
        }
    });

newsPermissions
    .defineRole("news-manager-homepage",
        [
            "add-homepage-news",
            "edit-homepage-news",
            "delete-homepage-news"
        ], {
        en: {
            name: "homepage news manager",
            summary: "manager for homepage news"
        },
        cn: {
            name: "首页新闻管理",
            summary: "可以增删改首页新闻信息的角色"
        },
        options: {
            level: adminLevel
        }
    })
    //.defineRole("news-manager-publisher",
    //    [
    //        "add-publisher-news",
    //        "edit-publisher-news",
    //        "delete-publisher-news"
    //    ], {
    //    en: {
    //        name: "publisher news manager",
    //        summary: "manager for news publisher"
    //    },
    //    cn: {
    //        name: "出版商新闻管理",
    //        summary: "可以增删改出版商新闻信息的角色"
    //    },
    //    options: {
    //        level: publisherLevel
    //    }
    //})
    .defineRole("news-manager-journal",
        [
            "add-journal-news",
            "edit-journal-news",
            "delete-journal-news"
        ], {
        en: {
            name: "journal news manager",
            summary: "manager for journal news"
        },
        cn: {
            name: "期刊新闻管理",
            summary: "可以增删改期刊新闻信息的角色"
        },
        options: {
            level: journalLevel
        }
    });
