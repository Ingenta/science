publisherPermissions = new Permissions.Registrar('publisher');

publisherPermissions
    .definePermission("use-publisher-panel",{
        en: {name: "use publisher panel", summary: "use publisher panel"},
        cn: {name: "可以使用管理员面板", summary: "可以使用管理员面板"},
        options:{
            level:publisherLevel
        }
    })
    .definePermission("add-publisher", {
        en: {name: "add publisher", summary: "can add publisher"},
        cn: {name: "添加出版商", summary: "您可以添加新出版商到系统中"},
        options:{
            level:adminLevel
        }
    })
    .definePermission("modify-publisher", {
        en: {name: "modify publisher", summary: "can modify publisher"},
        cn: {name: "编辑出版商", summary: "可以编辑出版商信息"},
        options:{
            level:publisherLevel
        }
    })
    .definePermission("delete-publisher", {
        en: {name: "delete publisher", summary: "can delete publisher"},
        cn: {name: "删除出版商", summary: "您可以删除出版商信息"},
        options:{
            level:adminLevel
        }
    });

publisherPermissions
    .defineRole("publisher-manager-from-user", [
        "permissions:delegate-and-revoke",
        "permissions:get-users-roles",

        "use-publisher-panel",
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

        "collections:add-publisher-collection",
        "collections:modify-publisher-collection",
        "collections:delete-publisher-collection",
        "collections:add-article-to-publisher-collection",
        "collections:remove-article-from-publisher-collection",

        "collections:add-journal-collection",
        "collections:modify-journal-collection",
        "collections:delete-journal-collection",
        "collections:add-article-to-journal-collection",
        "collections:remove-article-from-journal-collection",

        "collections:add-special-issue",
        "collections:modify-special-issue",
        "collections:delete-special-issue",
        "collections:add-article-to-special-issue",
        "collections:remove-article-from-special-issue"

    ], {
        en: {
            name: "publisher manager (publisher)",
            summary: "publisher manager"
        },
        cn: {
            name: "出版商管理员 (出版商)",
            summary: "只能修改出版社信息的角色"
        },
        options:{
            level:publisherLevel
        }
    });
