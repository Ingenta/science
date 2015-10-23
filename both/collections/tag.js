this.Tags = new Meteor.Collection("tag");

this.Tags.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-tag", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-tag", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-tag", "resource", userId);
    }
});

TagsSchema = new SimpleSchema({
    tagNumber: {
        type: String,
        unique: true
    },
    name: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    icon: {
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
    url: {
        type: String,
        optional: true
    },
    createdBy: {
        type: String
    },
    createDate: {
        type: Date
    }
});
Meteor.startup(function () {
    TagsSchema.i18n("schemas.tags");
    Tags.attachSchema(TagsSchema);
});