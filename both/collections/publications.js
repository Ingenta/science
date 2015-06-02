this.Publications = new Meteor.Collection("publications");

PublicationsSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    firstletter:{
        type: String,
        max: 1
    },
    accessKey: {
      type: String,
  },
  description: {
    type: String,
    optional: true,
    autoform: {
        rows: 4
    }
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
        collection: 'Images',
        accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
    }
},
label: 'Choose file'
}
});
Meteor.startup(function() {
    PublicationsSchema .i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});
