var currentUploadProgress = new ReactiveVar(false);
var trySubmit =new ReactiveVar(false);

Template.addMediaForm.helpers({
	progress: function() {
		return currentUploadProgress.get();
	},
	isMediaInvalid:function(){
		return trySubmit.get();
	}
});

Template.addMediaForm.events({
	'click .btn-primary':function(e,context){
		e.preventDefault();
		//check file uploader,make sure selected
		var fileCtl = Template.instance().$(".media-uploader");
		var isInvalid=!fileCtl.val();
		trySubmit.set(isInvalid);
		if(isInvalid)
			return false;
		//end of check
		var journalId=Session.get('currentJournalId');
		if(!journalId){
			return "can't find journal's id";
		}
		var formData = {journalId:journalId};
		var formCtls=Template.instance().$('.form-control');
		_.each(formCtls,function(item){
			formData[$(item).attr('name')]=$(item).val();
		})
		formData=deepen(formData);
		Medias.insert({
			file:fileCtl[0].files[0],
			meta:formData,
			onUploaded:function(err,fileObj){
				currentUploadProgress.set(false);
				formCtls.val("");
				$("#jkafModal").modal('hide');
			},
			onProgress: function(progress){
				currentUploadProgress.set(progress);
			},
			onBeforeUpload: function() {
				var allowedExt, allowedMaxSize;
				allowedExt = Config.Media.allowType;
				allowedMaxSize = Config.Media.maxSize*1024*1024;
				if (allowedExt.inArray(this.ext) && this.size < allowedMaxSize) {
					return true;
				} else {
					return "Max upload size is " + Config.Media.maxSize + " Mb. Allowed extensions is " + (allowedExt.join(', '));
				}
			},
			streams: 8
		})
		return true;

	},
	'change .form-control[name="media"]':function(e){
		e.preventDefault();
		var isInvalid=!Template.instance().$(".media-uploader").val();
		trySubmit.set(isInvalid)
	}
})

Template.mediaList.helpers({
	medias:function(){
		return Medias.find({"meta.journalId":this._id}).get();
	},
	dynamicTemp:function(){
		switch (this.type){
			case 'video/mp4':
				return 'videoTemplate';
			case 'audio/mp3':
				return 'audioTemplate';
			default :
				return 'fileDownloadTemplate';
		}
	}
})

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
			Medias.remove({_id:id});
			sweetAlert({
				title:TAPi18n.__("Deleted"),
				text:TAPi18n.__("Operation_success"),
				type:"success",
				timer:2000
			});
		});
	}
})