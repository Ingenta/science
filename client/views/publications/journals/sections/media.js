var uploadingFile = new ReactiveVar(false);

Template.addMediaForm.helpers({
	uploadedFiles: function() {
		var curId=uploadingFile.get();

		return curId && Collections.Files.find({_id:curId});
	}
});

Template.addMediaForm.events({
	'change input.any': FS.EventHandlers.insertFiles(Collections.Files, {
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
				console.log("Inserted", fileObj.name());
			}
		}
	})
})

Template.mediaList.helpers({
	medias:function(){
		var jid=Session.get("currJournalId") || this._id;
		if(jid)
			return Collections.Medias.find({"journalId":jid});
	},
	dynamicTemp:function(){
		var file = Collections.Files.findOne({_id:this.fileId});
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
		var file = Collections.Files.findOne({_id:this.fileId});
		return file;
	}
});

Template.mediaList.events({
	'click .fa-trash':function(e){
		e.preventDefault();
		var id = this._id;
		sweetAlert({
			title             : TAPi18n.__("Warning"),
			text              : TAPi18n.__("Confirm_delete"),
			type              : "warning",
			showCancelButton  : true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText : TAPi18n.__("Do_it"),
			cancelButtonText  : TAPi18n.__("Cancel"),
			closeOnConfirm    : false
		}, function () {
			Collections.Medias.remove({_id:id});
			sweetAlert({
				title:TAPi18n.__("Deleted"),
				text:TAPi18n.__("Operation_success"),
				type:"success",
				timer:2000
			});
		});
	}
})


AutoForm.addHooks(['addMediaModalForm'],{
	onSuccess: function () {
		$("#jkafModal").modal('hide');
		uploadingFile.set(false);
		FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
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