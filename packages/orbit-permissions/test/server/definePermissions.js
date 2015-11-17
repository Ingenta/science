var addUsers, emailToUsername;

emailToUsername = function(email) {
	return email.replace(/@.*/, "");
};

addUsers = function(emails) {
	return _.map(emails, function(email) {
		var username;
		username = emailToUsername(email);
		if (Meteor.users.find({
					username: username
				}).count() > 0) {
			Meteor.users.remove({
				username: username
			});
		}
		return Accounts.createUser({
			email: email,
			username: username,
			password: '123123'
		});
	});
};

Tinytest.add('Permissions Registrar - 定义自鉴权方法,并调用此鉴权方法', function(test) {
	new OrbitPermissions.Registrar("test-self-check1").definePermission("perm-test", {
		cn:{name:"aaaaaaa",summary:"bbbbbbbbb"},
		en:{name:"cccccccc",summary:"dddddddd"},
		options: {
			selfCheck: function () {
				test.equal(1, 1);
			}
		}
	})
	OrbitPermissions.getPermissionsDescriptions()["test-self-check1:perm-test"].options.selfCheck();
});

Tinytest.add('Permissions Registrar - 定义含有依赖关系的包角色', function(test) {
	var registrar = new OrbitPermissions.Registrar("testpackage1").definePermission("perm-test", {
		cn:{name:"aaaaaaa",summary:"bbbbbbbbb"},
		en:{name:"cccccccc",summary:"dddddddd"}
	})

	if(!OrbitPermissions.getRoles()["testpackage1:role-test2"])
		registrar.defineRole("role-test2",["testpackage1:perm-test"],{cn:{name:"testrole",summary:"test role"},options:{dependency:["publisher"]}});

	var roleDesc=OrbitPermissions.getRolesDescriptions()["testpackage1:role-test2"];
	test.equal(roleDesc.options.dependency[0],"publisher");
});


if(Meteor.isServer){
	Tinytest.add('Permissions Registrar - 为用户设置自检查权限', function(test) {
		//定义权限
		var registrar=new OrbitPermissions.Registrar("testpackage").definePermission("perm-test", {
			cn:{name:"aaaaaaa",summary:"bbbbbbbbb"},
			en:{name:"cccccccc",summary:"dddddddd"}
		});
		//定义角色
		if(!OrbitPermissions.getRoles()["testpackage:role-test"]){
			//若已经定义过该角色,则不再重复定义
			registrar.defineRole("role-test",["testpackage:perm-test"],{cn:{name:"rolecn"},en:{name:"roleen"},options:{dependency:["publisher"]}});
		}
		var userId = addUsers(['test@test.com'])[0];
		OrbitPermissions.delegate(userId,[{"role":"testpackage:role-test",range:{publisher:["publishera","publisherb"]}}]);
		var a = OrbitPermissions.userCan("perm-test","testpackage",userId,{publisher:["publishera"]});
		test.equal(a,true);
	});
}
