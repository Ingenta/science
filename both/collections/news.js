this.News = new Meteor.Collection("news");

NewsSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    },
    createDate: {
        type: Date,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    author: {
        type: Science.schemas.MultipleTextSchema,
        optional: true
    },
    abstract: {
        type: Science.schemas.MultipleAreaSchema,
        optional: true
    },
    content: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    url: {
        type: String,
        optional: true
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
    types: {
        type: String
    },
    about: {
        type: String,
        optional: true
    },
    publications: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    NewsSchema.i18n("schemas.news");
    News.attachSchema(NewsSchema);
});
