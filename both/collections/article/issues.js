this.Issues = new Meteor.Collection("issues");

if(Meteor.isServer){
    Issues.after.update(function (userId, doc, fieldNames, modifier) {
        lastIssue=Issues.findOne({journalId:doc.journalId,partial:true},{sort:{order:-1}});
        if(lastIssue._id==doc._id){
            Publications.update({_id:doc.journalId},{$set:{picture:doc.picture}});
        }
    });
}

IssuesSchema = new SimpleSchema({
    journalId:{
        type: String
    },
    volume:{
        type: String
    },
    issue:{
        type: String
    },
    year: {
        type: String
    },
    month: {
        type: String,
        optional:true
    },
    partial: {
        type: Boolean,
        defaultValue: false
    },
    picture: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png',
                label: function () {
                    return TAPi18n.__("Choose file")
                }
            }
        }
    },
    description: {
        type: String,
        optional:true,
        autoform: {
            type: "jkfroala",
            afFieldInput: {
                froalaOptions: {
                    language:'zh_cn',
                    inlineMode: false,
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle','align', 'outdent', 'indent','table', 'undo', 'redo'],
                    height: '400'
                }
            }
        }
    },
    descriptionCn: {
        type: String,
        optional: true,
        autoform: {
            type: "jkfroala",
            afFieldInput: {
                froalaOptions: {
                    language:'zh_cn',
                    inlineMode: false,
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle','align', 'outdent', 'indent','table', 'undo', 'redo'],
                    height: '400'
                }
            }
        }
    },
    order:{
        type: String,
        optional:true
    },
    updateDate: {
        type: Date,
        optional:true
    },
    createDate: {
        type: Date
    }
});

Meteor.startup(function () {
    IssuesSchema.i18n("schemas.issues");
    Issues.attachSchema(IssuesSchema);
});
