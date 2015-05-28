this.Publishers = new Meteor.Collection("publishers");
this.Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "C:/uploads"})]
});
PublishersSchema  = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    chinesename: {
        type: String,
        unique: true
    },
    website: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Url
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    chinesedescription: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    picture: {
        type: String,
        optional: true,
        autoform: {
          afFieldInput: {
            type: 'fileUpload',
            collection: 'Images'
        }
    },
    label: 'Choose file'
}
});
Meteor.startup(function() {
    PublishersSchema.i18n("schemas.publishers");
    Publishers.attachSchema(PublishersSchema);
});
Images.allow({
    insert: function (userId, doc) {
        return true;
    },
    download: function (userId) {
        return true;
    }
});
