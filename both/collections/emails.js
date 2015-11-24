EmailsSchema  = new SimpleSchema({
    recipient:{
        type:String
    },
    reasons:{
        type:String,
        optional: true
    },
    url:{
        type:String,
        autoform:{
            type: "hidden"
        }
    },
    doi:{
        type:String,
        autoform:{
            type: "hidden"
        }
    }
});

Meteor.startup(function(){
    EmailsSchema.i18n("schemas.emails");
})