this.Recommend = new Meteor.Collection("recommend");

RecommendSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    chineseTitle: {
        type: String
    },
    behalfPicture: {
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
    defaultPicture: {
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
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    RecommendSchema.i18n("schemas.recommend");
    Recommend.attachSchema(RecommendSchema);
});