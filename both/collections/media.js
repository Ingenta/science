this.Medias = new Meteor.Files({
	collectionName: 'MediaFiles',
	storagePath   : 'assets/',
	onBeforeUpload: function () {
		var allowedExt;
		allowedExt = Config.Media.allowType;
		if (allowedExt.inArray(this.ext) && this.size < Config.Media.maxSize  * 1024 * 1024) {
			return true;
		}
	}
});