resourcePermissions = new Permissions.Registrar('publication');

resourcePermissions
    .defineRole("journal-manager-publisher", [
        "resource:modify-journal",

        "resource:add-article",
        "resource:modify-article",
        "resource:delete-article",

        "advertisement:add-journal-advertisement",
        "advertisement:modify-journal-advertisement",
        "advertisement:delete-journal-advertisement"
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
