this.EditorsRecommend = new Meteor.Collection("recommend");

this.EditorsRecommend.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-recommend", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-recommend", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-recommend", "resource", userId);
    }
});

RecommendSchema = new SimpleSchema({
    ArticlesId: {
        type: String,
        unique: true,
        autoform: {
                type: 'select2'
        }
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
    },
    createDate: {
        type: Date
}
});
Meteor.startup(function () {
    RecommendSchema.i18n("schemas.recommend");
    EditorsRecommend.attachSchema(RecommendSchema);
});