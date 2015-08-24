EmailsSchema  = new SimpleSchema({
    myEmail:{
        type:String
    },
    youEmail:{
        type:String
    },
    subject:{
        type:String
    }
});

Meteor.startup(function(){
    EmailsSchema.i18n("schemas.emails");
})