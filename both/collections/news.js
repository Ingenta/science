this.News = new Meteor.Collection("news");

NewsSchema = new SimpleSchema({
	title: {
		type: String,
		unique: true
	},
	description: {
		type: String,
		optional: true,
		autoform: {
			rows: 4
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
	}
});
Meteor.startup(function () {
	NewsSchema.i18n("schemas.news");
	News.attachSchema(NewsSchema);
});
