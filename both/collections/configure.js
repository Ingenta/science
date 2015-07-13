this.Configure = new Meteor.Collection("configure");

ConfigureSchema = new SimpleSchema({
    ftpName: {
        type: String,
        unique: true
    },
    port: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    },
    filePath: {
        type: String
    }
});
Meteor.startup(function () {
    ConfigureSchema.i18n("schemas.configure");
    Configure.attachSchema(ConfigureSchema);
});
