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
    });

publisherPermissions
    .defineRole("publisher-manager-from-user", [
        "permissions:delegate-and-revoke",
        "permissions:get-users-roles",

        "modify-publisher",

        "user:add-user",
        "user:modify-user",
        "user:list-user",

        "resource:add-journal",
        "resource:modify-journal",
        "resource:delete-journal",

        "resource:add-article",
        "resource:modify-article",
        "resource:delete-article",

        "advertisement:add-journal-advertisement",
        "advertisement:modify-journal-advertisement",
        "advertisement:delete-journal-advertisement",

        "collections:add-publisher-collections",
        "collections:modify-publisher-collections",
        "collections:delete-publisher-collections",

        "collections:add-journal-collections",
        "collections:modify-journal-collections",
        "collections:delete-journal-collections"

    ], {
        en: {
            name: "publisher manager (publisher)",
            summary: "publisher manager"
        },
        cn: {
            name: "出版商管理员 (出版商)",
            summary: "只能修改出版社信息的角色"
        }
    });
