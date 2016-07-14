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
Science.schemas.MultipleTextOptionalSchema = new SimpleSchema({
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
Science.schemas.MultipleTextRequiredSchema = new SimpleSchema({
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
		optional:true,
		autoform: {
			type: "jkfroala",
			afFieldInput: {
				froalaOptions: {
					language:'zh_cn',
					inlineMode: false,
					buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'selectAll', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'html', 'insertHorizontalRule', 'removeFormat', 'fullscreen'],
					height: '400',
					imageUploadURL:"/upload_froala",
					fileUploadURL:"/upload_froala_file",
					tableResizerOffset: 10,
					tableResizingLimit: 20,
					imageMaxSize: 1024 * 1024 * 1
				}
			}
		}
	},
	cn:{
		type: String,
		optional: true,
		autoform: {
			type: "jkfroala",
			afFieldInput: {
				froalaOptions: {
					language:'zh_cn',
					inlineMode: false,
					buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'selectAll', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'html', 'insertHorizontalRule', 'removeFormat', 'fullscreen'],
					height: '400',
					imageUploadURL:"/upload_froala",
					fileUploadURL:"/upload_froala_file",
					tableResizerOffset: 10,
					tableResizingLimit: 20,
					imageMaxSize: 1024 * 1024 * 1
				}
			}
		}
	}
});
// 出版商专用富文本格式
Science.schemas.PublisherMultipleTextAreaSchema = new SimpleSchema({
	en:{
		type: String,
		optional:true,
		autoform: {
			type: "jkfroala",
			afFieldInput: {
				froalaOptions: {
					language:'zh_cn',
					inlineMode: false,
					buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle','table', 'undo', 'redo'],
					height: '400'
				}
			}
		}
	},
	cn:{
		type: String,
		optional: true,
		autoform: {
			type: "jkfroala",
			afFieldInput: {
				froalaOptions: {
					language:'zh_cn',
					inlineMode: false,
					buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle','table', 'undo', 'redo'],
					height: '400'
				}
			}
		}
	}
});