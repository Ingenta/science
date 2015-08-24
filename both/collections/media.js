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

MediasSchema  = new SimpleSchema({
	title:{
		type:Science.schemas.MultiLangSchema
	},
	description:{
		optional:true,
		type:Science.schemas.MultipleAreaSchema
	//},
	//media:{
	//	type:String
	}
});

Meteor.startup(function(){
	MediasSchema.i18n("schemas.medias");
})