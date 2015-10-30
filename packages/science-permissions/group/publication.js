resourcePermissions = new Permissions.Registrar('publication');

resourcePermissions
    .defineRole("journal-manager-publisher", [
        "resource:modify-journal",

        "resource:add-article",
        "resource:modify-article",
        "resource:delete-article",

        "advertisement:add-journal-advertisement",
        "advertisement:modify-journal-advertisement",
        "advertisement:delete-journal-advertisement",

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
            name: "journal manager (publisher)",
            summary: "journal manager"
        },
        cn: {
            name: "期刊管理员 (出版商)",
            summary: "期刊管理员"
        }
    });
