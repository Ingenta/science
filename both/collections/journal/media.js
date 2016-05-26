Collections.Medias = new Mongo.Collection("medias");

if(Meteor.isServer){
	Collections.Medias.before.insert(function (userId, doc) {
		if(!doc.doi) return;
		var article = Articles.findOne({doi:doc.doi});
		if(!article) return;
		doc.volumeId=article.volumeId;
		doc.issueId=article.issueId;
	})
	Collections.Medias.allow({
		insert: function (userId, doc) {
			return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.journalId});
		},
		update: function (userId, doc) {
			return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.journalId});
		},
		remove: function (userId, doc) {
			return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.journalId});
		}
	})
}

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
	},
	doi:{
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