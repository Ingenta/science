Collections.Medias = new Mongo.Collection("medias");

if(Meteor.isServer){
	//Collections.Medias.after.insert(function (userId, doc) {
	//	if(!doc.doi) return;
	//	var article = Articles.findOne({doi:doc.doi});
	//	if(!article) return;
	//	if(article.moop) return; //article的MOOP标记已经为真,则认为其所属的卷期也已经有MOOP真标记
     //
	//	Articles.update({doi:doc.doi},{$set:{moop:true}});
	//	var issue = Issues.findOne({_id:article.issueId});
	//	if(issue.moop) return; //issue的MOOP标记已经为真,则认为其所属的卷也已经有MOOP真标记
	//	Issues.update({_id:article.issueId},{$set:{moop:true}});
     //
	//	var volume = Volumes.findOne({_id:article.volumeId});
	//	if(volume.moop) return;
	//	Volumes.update({_id:article.volumeId},{$set:{moop:true}});
	//
	//
	//});

	//Collections.Medias.after.remove(function(userId,doc){
	//	if(doc.doi){
	//		if(Collections.Medias.find({doi:doc.doi}).count()==0){
	//			Articles.update({doi:doc.doi},{$set:{moop:false}});
	//		}
	//	}
	//})
	Collections.Medias.before.insert(function (userId, doc) {
		if(!doc.doi) return;
		var article = Articles.findOne({doi:doc.doi});
		if(!article) return;
		doc.volumeId=article.volumeId;
		doc.issueId=article.issueId;
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