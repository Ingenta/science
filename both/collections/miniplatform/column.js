this.Column = new Meteor.Collection("column");

this.Column.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-column", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-column", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-column", "resource", userId);
    }
});

ColumnSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    types: {
        type: String
    }
});
Meteor.startup(function () {
    ColumnSchema.i18n("schemas.column");
    Column.attachSchema(ColumnSchema);
});
