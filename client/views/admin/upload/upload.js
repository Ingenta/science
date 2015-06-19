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
            var fileId;
            ArticleXml.insert(file, function (err, fileObj) {
                console.log("inside");
                console.log(fileObj._id);
                fileId = fileObj._id;
                UploadLog.insert({fileId: fileObj._id, name: fileObj.name(), uploadedAt: new Date(), errors: errors, status: status});
            });

            //need to wait here for upload to finish to get fileid so we can get the path

            //get url
            var path = ArticleXml.findOne().url();
            //call parse and put results in session
            Meteor.call('parseXml', path, function(error, result) {
             if(error){
               console.log(error)
           }else{
                //add article object to session
                console.log(result)
                Session.set("title", result);
            }
        });
        });
}
});

Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find();
    }
});

