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
        //     var path = ArticleXml.findOne().url();
        //     //call parse and put results in session
        //     Meteor.call('parseXml', path, function(error, result) {
        //      if(error){
        //        console.log(error)
        //    }else{
        //         //add article object to session
        //         console.log(result)
        //         Session.set("title", result);
        //     }
        // });
        });
}
});

Template.UploadLogModal.helpers({
    results : function(){
        return Session.get("title");
    }
});
Template.uploadTableRow.events({
    "click .btn" : function(e){
        var button = $(e.target) // Button that triggered the modal
        var uploadLogId = button.data('logid') // Extract info from data-* attributes

        var id = UploadLog.findOne({_id:uploadLogId}).fileId;
        var path = ArticleXml.findOne({_id:id}).url();
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
        //go get the parse results for this id if sucess or errors if failed
        // if(button.html()==="Failed"){
        //     $('modal-body').html("hello")
        // }
        // var errors = UploadLog.findOne({_id:uploadLogId}).errors;
    }
});

Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find();
    }
});

