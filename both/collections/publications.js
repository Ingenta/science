this.Publications = new Meteor.Collection("publications");

PublicationsSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    firstletter: {
        type: String,
        max: 1
    },
    accessKey: {
        type: String
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    },
    publisher: {
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
        }
    },
    banner: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
            }
        }
    },
    tabSelections: {
        type: [String],
        autoform: {
            type: "select-checkbox-inline",
            options: function () {
                return [
                    {label : "Overview",  value: "Overview"},
                    {label : "Browse", value: "Browse"},
                    {label : "About", value: "About"},
                    {label : "Editorial Board",  value: "Editorial Board"},
                    {label : "News", value: "News"},
                    {label : "Media", value: "Media"},
                    {label : "Special Topics",  value: "Special Topics"},
                    {label : "Collections", value: "Collections"},
                    {label : "Accepted", value: "Accepted"},
                    {label : "Online First",  value: "Online First"},
                    {label : "MOOP", value: "MOOP"},
                    {label : "Author", value: "Author"}
                ];
            }
        }
    }
});
Meteor.startup(function () {
    PublicationsSchema.i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});
