var uploadingFile = new ReactiveVar(false);

Template.addMediaForm.helpers({
	uploadedFiles: function() {
		var curId=uploadingFile.get();

		return curId && Collections.JournalMediaFileStore.find({_id:curId});
	}
});

Template.addMediaForm.events({
	'change input.any': FS.EventHandlers.insertFiles(Collections.JournalMediaFileStore, {
		metadata: function (fileObj) {
			return {
				owner: Meteor.userId(),
				foo: "bar",
				dropped: false
			};
		},
		after: function (error, fileObj) {
			if (!error) {
				uploadingFile.set(fileObj._id);
			}
		}
	})
})

Template.mediaList.helpers({
	medias:function(){
		var jid=Session.get("currJournalId") || this._id;
		if(jid)
			return Collections.Medias.find({"journalId":jid,doi:null});
	},
	dynamicTemp:function(){
		var file = Collections.JournalMediaFileStore.findOne({_id:this.fileId});
		if(file){
			var ftype=file.original.type;
			switch (ftype){
				case 'video/mp4':
					return 'videoTemplate';
				case 'audio/mp3':
					return 'audioTemplate';
				default :
					return 'fileDownloadTemplate';
			}
		}
	},
	getdata:function(){
		var file = Collections.JournalMediaFileStore.findOne({_id:this.fileId});
		return file;
	}
});

Template.mediaList.events({
	'click .fa-trash':function(e){
		e.preventDefault();
		var id = this._id;
		confirmDelete(e,function(){
			Collections.Medias.remove({_id:id});
		})
	}
})


AutoForm.addHooks(['addMediaModalForm'],{
	onSuccess: function () {
		$("#jkafModal").modal('hide');
		uploadingFile.set(false);
		FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
	},
	before: {
		insert: function (doc) {
			doc.createDate = new Date();
			doc.fileId=uploadingFile.get();
			doc.journalId = Session.get('currentJournalId');
			return doc;
		}
	}
})

AutoForm.addHooks(['updateMediaModalForm'],{
	onSuccess: function () {
		$("#jkafModal").modal('hide');
		uploadingFile.set(false);
		FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
	},
	before: {
		update: function (doc) {
			doc.updateDate = new Date();
			doc.fileId=uploadingFile.get();
			return doc;
		}
	}
})