var uploadingFile = new ReactiveVar(false);

Template.addArticleMediaForm.helpers({
    uploadedFiles: function() {
        var curId=uploadingFile.get();
        return curId && Collections.JournalMediaFileStore.find({_id:curId});
    }
});

Template.addArticleMediaForm.events({
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
});

Template.articleMedia.helpers({
    medias:function(){
        var doi = Session.get('currentDoi');
        var journalId = Session.get('currentJournalId');
        if(doi)
            return Collections.Medias.find({"doi":doi,"journalId":journalId});
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

Template.articleMedia.events({
    'click .fa-trash':function(e){
        e.preventDefault();
        var id = this._id;
        confirmDelete(e,function(){
            Collections.Medias.remove({_id:id});
        })
    }
});


AutoForm.addHooks(['addArticleMediaModalForm'],{
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
            doc.doi = Session.get('currentDoi');
            return doc;
        }
    }
});

AutoForm.addHooks(['updateArticleMediaForm'],{
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
});