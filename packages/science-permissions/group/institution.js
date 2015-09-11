institutionPermissions = new Permissions.Registrar('institution');

institutionPermissions
    .definePermission("add-institution", {
        en: {name: "add institution", summary: "can add institution"},
        cn: {name: "添加机构", summary: "您可以添加新机构到系统中"}
    })
    .definePermission("modify-institution", {
        en: {name: "modify institution", summary: "can modify institution"},
        cn: {name: "编辑机构", summary: "可以编辑机构信息"}
    })
    .definePermission("delete-institution", {
        en: {name: "delete institution", summary: "can delete institution"},
        cn: {name: "删除机构", summary: "您可以删除机构信息"}
    });

institutionPermissions
    .defineRole("institution-manager-from-admin", ["add-institution", "modify-institution", "delete-institution"], {
        en: {
            name: "institution manager (platform)",
            summary: "system admin of institution"
        },
        cn: {
            name: "机构管理（平台）",
            summary: "可以增删改机构信息的角色"
        }
    })
    .defineRole("institution-manager-from-user", ["modify-institution"], {
        en: {
            name: "institution manager (institution)",
            summary: "institution manager"
        },
        cn: {
            name: "机构管理(机构)",
            summary: "只能修改机构信息的角色"
        }
    });
