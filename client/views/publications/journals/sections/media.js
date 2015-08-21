var currentUploadProgress = new ReactiveVar(false);

Template.addMediaForm.helpers({
	progress: function() {
		return currentUploadProgress.get();
	}
});

Template.addMediaForm.events({
	'change #file':function(e){
		_.each(e.currentTarget.files,function(file){
			Medias.insert({
				file:file,
				meta:{
					journalId:"test"
				},
				onUploaded:function(err,fileObj){
					if(!err){
						console.log(fileObj);
					}
					currentUploadProgress.set(false);
					template.$(e.target).val('');
					template.$(e.currentTarget).val('');
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
		})
	}
})



Template.mediaList.helpers({
	medias:function(){
		return Medias.find({"meta.journalId":'test'}).get();
	}
})