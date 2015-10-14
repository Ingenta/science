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
    })
    .definePermission("add-user", {
        en: {name: "add user", summary: "can add user"},
        cn: {name: "添加出版商用户", summary: "您可以添加新出版商用户到系统中"}
    })
    .definePermission("modify-user", {
        en: {name: "modify user", summary: "can modify user"},
        cn: {name: "编辑出版商用户", summary: "可以编辑出版商用户信息"}
    });

publisherPermissions
    //.defineRole("publisher-manager-from-admin", ["add-publisher", "modify-publisher", "delete-publisher", "add-user", "modify-user"], {
    //    en: {
    //        name: "publisher manager (platform)",
    //        summary: "system admin of publisher"
    //    },
    //    cn: {
    //        name: "出版社管理（平台）",
    //        summary: "可以增删改出版社信息的角色"
    //    }
    //})
    .defineRole("publisher-manager-from-user", ["modify-publisher", "add-user", "modify-user"], {
        en: {
            name: "publisher manager (publisher)",
            summary: "publisher manager"
        },
        cn: {
            name: "出版社管理 (机构)",
            summary: "只能修改出版社信息的角色"
        }
    });
