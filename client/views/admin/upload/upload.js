Template.uploadForm.events({
    'change .myFileInput': function (event, template) {
        FS.Utility.eachFile(event, function (file) {
            var errors = [];
            var status;
            if(file.type==="text/xml"){
                status = "Pending";
            } else{
                status = "Failed";
                errors.push("File type mismatch!")
            }
            var fileId;
            ArticleXml.insert(file, function (err, fileObj) {
                fileId = fileObj._id;
                UploadLog.insert({fileId: fileObj._id, name: fileObj.name(), uploadedAt: new Date(), errors: errors, status: status});
            });

            //need to wait here for upload to finish to get fileid so we can get the path
            //parse file on upload
        });
    }
});

Template.UploadLogModal.helpers({
    results : function(){
        return Session.get("title");
    },
    errors : function(){
        return Session.get("errors");
    }
});
Template.uploadTableRow.events({
    "click .btn" : function(e){
        //get this item in the table
        var button = $(e.target) // Button that triggered the modal
        var uploadLogId = button.data('logid') // Extract info from data-* attributes

        //get failed state
        var log = UploadLog.findOne({_id:uploadLogId});
        if(log.errors.length){ //if file is not xml guard then return
            console.log(log.errors.length)
            Session.set('errors', log.errors);
            Session.set("title", log.name);
            return;
        }

        //Session.set('errors', errors);
        $('#exampleModalLabel').html(log.state);
        var id = log.fileId;
        var path = ArticleXml.findOne({_id:id}).url();
            //call parse and put results in session
            Meteor.call('parseXml', path, function(error, result) {
               if(error){
                 log.errors.push(error);
                 Session.set('errors', log.errors);
                 console.log(log.errors[0]);
                 Session.set("title", undefined);
                 UploadLog.update({_id:uploadLogId},{$set: {status:"Failed"}});
             }else{
                //add article object to session
                console.log(result)
                log.errors.push(result.errors)
                console.log(log.errors[0]);
                Session.set('errors', log.errors);
                Session.set("title", result);
                UploadLog.update({_id:uploadLogId},{$set: {status:"Success"}});
            }
        });

        }
    });

Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find();
    }
});
