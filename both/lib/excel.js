var excelStore = new FS.Store.FileSystem("excels",{
	path: Config.uploadExcelDir
});

Collections.Excels = new FS.Collection("excels",{
	stores:[excelStore]
});



if(Meteor.isServer){
	function trueFunc(userId) {
		//if (!userId) {
		//	// must be logged in
		//	return false;
		//}

		return true;
	};

	Collections.Excels.allow({
		insert: trueFunc,
		update: trueFunc,
		remove: trueFunc,
		download: trueFunc
	});
}