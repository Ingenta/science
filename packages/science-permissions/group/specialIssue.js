specialIssuePermissions = new Permissions.Registrar('specialissue');

specialIssuePermissions
	//专题辑
	.definePermission("add-special-issue", {
		en: {name: "create special issue", summary: "can create special issue "},
		cn: {name: "创建专题辑", summary: "可以创建文章选自同一期的专题辑"},
		options:{
			level:journalLevel
		}
	})
	.definePermission("modify-issue", {
		en: {name: "Modify special issue", summary: "can Modify special issue "},
		cn: {name: "修改专题辑", summary: "可以修改文章选自同一期的专题辑"},
		options:{
			level:journalLevel
		}
	})
	.definePermission("del-issue", {
		en: {name: "delete special issue", summary: "can Delete special issue "},
		cn: {name: "删除专题辑", summary: "可以删除文章选自同一期的专题辑"},
		options:{
			level:journalLevel
		}
	});

specialIssuePermissions
	.defineRole("special-issue-manager", ["add-special-issue", "modify-issue", "del-issue"], {
		en: {
			name   : "special issue manager",
			summary: "manager for special issue"
		},
		cn: {
			name   : "专题辑管理员",
			summary: "可以管理专题辑相关功能"
		},options:{
			level:journalLevel
		}
	})