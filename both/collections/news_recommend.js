this.NewsRecommend = new Meteor.Collection("news_recommend");

this.NewsRecommend.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-newsRecommend", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-newsRecommend", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-newsRecommend", "resource", userId);
    }
});

NewsRecommendSchema = new SimpleSchema({
    ArticlesId: {
        type: String,
        unique: true,
        autoform: {
            type: 'universe-select'
        }
    },
    picture: {
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
    createDate: {
        type: Date
    }
});
Meteor.startup(function () {
    NewsRecommendSchema.i18n("schemas.newsRecommend");
    NewsRecommend.attachSchema(NewsRecommendSchema);
});