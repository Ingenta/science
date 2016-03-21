this.ColumnViews = new Meteor.Collection("column_views");

this.ColumnViews.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-column-views", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-column-views", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-column-views", "resource", userId);
    }
});

ColumnViewsSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    },
    abstract: {
        type: Science.schemas.MultipleAreaSchema,
        optional: true
    },
    content: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    releaseTime: {
        type: Date,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    columnId: {
        type: String
    },
    usersId: {
        type: String
    }
});
Meteor.startup(function () {
    ColumnViewsSchema.i18n("schemas.columnViews");
    ColumnViews.attachSchema(ColumnViewsSchema);
});