this.UploadLog = new Meteor.Collection("uploadLog");
this.UploadTasks = new Meteor.Collection("uploadTasks");

if (Meteor.isClient) {
    uploadLogPagination = new Paginator(UploadLog);
}