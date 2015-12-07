advertisementPermissions = new Permissions.Registrar('advertisement');

advertisementPermissions
    .definePermission("add-homepage-advertisement", {
        en: {name: "add homepage　advertisement", summary: "can add homepage　advertisement"},
        cn: {name: "添加平台广告", summary: "您可以添加新平台广告到系统中"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("modify-homepage-advertisement", {
        en: {name: "modify　homepage advertisement", summary: "can modify homepage　advertisement"},
        cn: {name: "编辑平台广告", summary: "可以编辑平台广告信息"},
        options: {
            level: adminLevel
        }
    })
    .definePermission("delete-homepage-advertisement", {
        en: {name: "delete homepage　advertisement", summary: "can delete homepage　advertisement"},
        cn: {name: "删除平台广告", summary: "您可以删除平台广告信息"},
        options: {
            level: adminLevel
        }
    })

    .definePermission("add-journal-advertisement", {
        en: {name: "add journal　advertisement", summary: "can add journal　advertisement"},
        cn: {name: "添加期刊主页广告", summary: "您可以添加新期刊主页广告到系统中"},
        options: {
            level: journalLevel
        }
    })
    .definePermission("modify-journal-advertisement", {
        en: {name: "modify　journal advertisement", summary: "can modify journal　advertisement"},
        cn: {name: "编辑期刊主页广告", summary: "可以编辑期刊主页广告信息"},
        options: {
            level: journalLevel
        }
    })
    .definePermission("delete-journal-advertisement", {
        en: {name: "delete journal　advertisement", summary: "can delete journal　advertisement"},
        cn: {name: "删除期刊主页广告", summary: "您可以删除期刊主页广告信息"},
        options: {
            level: journalLevel
        }
    });

advertisementPermissions
    .defineRole("homepage-advertisement-manager", [
        "add-homepage-advertisement",
        "modify-homepage-advertisement",
        "delete-homepage-advertisement"
    ], {
        en: {
            name: "homepage advertisement manager",
            summary: "homepage advertisement manager"
        },
        cn: {
            name: "首页广告编辑",
            summary: "首页广告编辑"
        },
        options: {
            level: adminLevel
        }
    })
    .defineRole("publisher-advertisement-manager", [
        "add-journal-advertisement",
        "modify-journal-advertisement",
        "delete-journal-advertisement"

    ], {
        en: {
            name: "publisher advertisement manager",
            summary: "publisher advertisement manager"
        },
        cn: {
            name: "期刊广告编辑",
            summary: "期刊广告编辑"
        },
        options: {
            level: journalLevel
        }
    });
