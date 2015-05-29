this.Publications = new Meteor.Collection("publications");

PublicationsSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    firstletter:{
        type: String,
        max: 1
    },
    accessKey: {
      type: String,
  },
  publisher:
  {
    type: String
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
    PublicationsSchema .i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});
