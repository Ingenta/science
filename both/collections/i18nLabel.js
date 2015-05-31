/**
 * Created by jiangkai on 2015/5/30.
 */
this.PTi18n = new Meteor.Collection("PTi18n");

PTi18nSchema = new SimpleSchema({
    code: {
        type: String,
        unique: true
    },
    en: {
        type: String
    },
    cn:{
        type: String
    }
});

Meteor.startup(function () {
    //TopicsSchema.i18n("schemas.topics");
    PTi18n.attachSchema(PTi18nSchema);
});
