this.Articles = new Meteor.Collection("articles");


this.Articles.allow({
	insert: function (userId, doc) {
		return Permissions.userCan("add-article", "resource", userId);
	},
	update: function (userId, doc) {
		return Permissions.userCan("modify-article", "resource", userId);
	},
	remove: function (userId, doc) {
		return Permissions.userCan("delete-article", "resource", userId);
	}
});

ArticleTitleSchema= new SimpleSchema({
	title:{
		type: Science.schemas.MultiLangSchema
	}
});
ArticleAbstractSchema=new SimpleSchema({
	abstract:{
		type: String,
        min: 20,
        max: 1000,
        autoform: {
            rows: 5
        }
	}
});
Meteor.startup(function(){
	ArticleTitleSchema.i18n("schemas.articles");
});
//ArticlesSchema  = new SimpleSchema({
//    title: {
//        type: String,
//        unique: true
//    },
//    authors:{
//        type: String
//    },
//    publisher:{
//        type: String
//    },
//    // volume:{
//    //     type: String
//    // },
//    // issue:{
//    //     type: String
//    // },
//    journalId: {
//        type: String
//    },
//    // volumeId:{
//    //     type: String
//    // },
//    // issueId: {
//    //     type: String
//    // },
//    // year:{
//    //     type: String
//    // },
//    // month:{
//    //     type: String
//    // },
//    topic:{
//        type: String
//    },
//    abstract:{
//        type: String,
//        min: 20,
//        max: 1000,
//        autoform: {
//            rows: 5
//        }
//    }
//});
//Meteor.startup(function() {
//    ArticlesSchema.i18n("schemas.article");
//    Articles.attachSchema(ArticlesSchema);
//});
