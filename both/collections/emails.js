EmailsSchema  = new SimpleSchema({
    recipient:{
        type:String
    },
    reasons:{
        type:String
    },
    url:{
        type:String,
        autoform:{
            type: "hidden"
        }
    }
});

Meteor.startup(function(){
    EmailsSchema.i18n("schemas.emails");
})