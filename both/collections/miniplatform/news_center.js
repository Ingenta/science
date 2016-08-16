this.NewsCenter = new Meteor.Collection("news_center");

this.NewsCenter.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-news-center", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-news-center", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-news-center", "resource", userId);
    }
});

NewsCenterSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    },
    author: {
        type: Science.schemas.MultipleTextOptionalSchema,
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
    recommend: {
        type: String,
        optional: true
    },
    link: {
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
        type: String,
        optional: true
    },
    fileId: {
        type: String,
        optional: true,
        autoform: {
            type: "cfs-file",
            collection: "files"
        }
    },
    releaseTime: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    createDate: {
        type: Date,
        optional: true
    },
    pageView: {
        type:Number,
        defaultValue: 0,
        optional: true
    }
});
Meteor.startup(function () {
    NewsCenterSchema.i18n("schemas.newsCenter");
    NewsCenter.attachSchema(NewsCenterSchema);
});

if (Meteor.isClient) {
    magazinesPaginator = new Paginator(NewsCenter);
    publishingPaginator = new Paginator(NewsCenter);
}