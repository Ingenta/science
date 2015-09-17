// 标题唯一
Science.schemas.MultiLangSchema = new SimpleSchema({
	en:{
		type: String,
		unique: true
	},
	cn:{
		type: String,
		unique: true
	}
});
// 非必填字段
Science.schemas.MultipleTextSchema = new SimpleSchema({
	en:{
		type: String,
		optional: true
	},
	cn:{
		type: String,
		optional: true
	}
});

//
Science.schemas.MultipleText1Schema = new SimpleSchema({
	en:{
		type: String
	},
	cn:{
		type: String
	}
});

// 普通文本
Science.schemas.MultipleAreaSchema = new SimpleSchema({
	en:{
		type: String,
		optional: true,
		autoform: {
			rows: 4
		}
	},
	cn:{
		type: String,
		optional: true,
		autoform: {
			rows: 4
		}
	}
});

// 富文本格式
Science.schemas.MultipleTextAreaSchema = new SimpleSchema({
	en:{
		type: String,
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'summernote',
				class: 'editor'
			}
		}
	},
	cn:{
		type: String,
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'summernote',
				class: 'editor'
			}
		}
	}
})