Collections.Files = new FS.Collection("files",{
	stores:[new FS.Store.GridFS("any")],
	chunkSize: 4 * 1024 * 1024
});



if(Meteor.isServer){
	function trueFunc(userId) {
		if (!userId) {
			// must be logged in
			return false;
		}

		return true;
	};

	Collections.Files.allow({
		insert: trueFunc,
		update: trueFunc,
		remove: trueFunc,
		download: trueFunc
	});
}