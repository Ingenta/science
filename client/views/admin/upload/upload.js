Template.uploadForm.events({
    'change .myFileInput': function (event, template) {
        FS.Utility.eachFile(event, function (file) {
            var errors = [];
            var status;
            if(file.type==="text/xml"){
                status = "Success";
            } else{
                status = "Failed";
                errors.push("File type mismatch!")
            }
            ArticleXml.insert(file, function (err, fileObj) {
                UploadLog.insert({fileId: fileObj._id, name: fileObj.name(), uploadedAt: new Date(), errors: errors, status: status});
            });
        });
    }
});

Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find();
    }
});
