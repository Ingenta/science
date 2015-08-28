Collections.Medias = new Mongo.Collection("medias");


MediasSchema  = new SimpleSchema({
	title:{
		type:Science.schemas.MultiLangSchema
	},
	description:{
		optional:true,
		type:Science.schemas.MultipleAreaSchema
	},
	fileId: {
		type: String,
		autoform: {
			type: "cfs-file",
			collection: "files"
		}
	},
	journalId:{
		type:String,
		optional:true,
		autoform:{
			type: "hidden"
		}

	}
});


Meteor.startup(function(){
	MediasSchema.i18n("schemas.medias");
	Collections.Medias.attachSchema(MediasSchema);
})