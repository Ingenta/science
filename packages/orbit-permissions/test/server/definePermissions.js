Tinytest.add('Permissions Registrar - 权限自检查', function(test) {
	new OrbitPermissions.Registrar("test-self-check").definePermission("perm-test", {
		cn:{name:"aaaaaaa",summary:"bbbbbbbbb"},
		en:{name:"cccccccc",summary:"dddddddd"},
		selfCheck:function(){
			test.equal(1,1);
		}
	})
	OrbitPermissions.getPermissionsDescriptions()["test-self-check:perm-test"].selfCheck();
});