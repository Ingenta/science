
  Template.uploadForm.events({
    'change .myFileInput': function(event, template) {
      FS.Utility.eachFile(event, function(file) {
        ArticleXml.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        // add time of upload
      });
      });
    }
  });

Template.AdminUpload.helpers({
  uploadHistory: function () {
    return ArticleXml.find();
  }
});
