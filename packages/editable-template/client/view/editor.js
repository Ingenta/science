/**
 * Created by jiangkai on 15/10/21.
 */
'use strict'

Template.etEditor.onRendered(function(){
	JET.editor().summernote({
		height: 300,
		lang: "zh-CN"//not work
	});
});

Template.etEditor.events({
	'click .preview':function(e){
		JET.compile();
	},
	'click .save':function(e){
		JET.name=Template.instance().$("#etName").val();
		JET.description=Template.instance().$("#etDescription").val();
		JET.
		JET.save();
	},
	'keyup #etName':function(){
		var inputName = Template.instance().$("#etName").val();
		if(JET.verifyName(inputName) && inputName !== JET.name){
			var instance = Template.instance();
			Meteor.subscribe("oneEditableTemplate",inputName,{
				onReady:function(){
					var obj = JET.store.findOne({name:inputName});
					if(obj){
						instance.$("#etDescription").val(obj.description);
						instance.$("#etData").val(obj.previewData);
						JET.editor().code(obj.content)
					}else{
						instance.$("#etDescription").val("");
						instance.$("#etData").val("");
						JET.editor().code("");
					}
				}
			})
		}
	}
});

//Template.etEditor.helpers({
//	"editorOptions": function() {
//		return {
//			lineNumbers: true,
//			mode: "javascript"
//		}
//	},
//	"editorCode": function() {
//		return "Code to show in editor";
//	}
//})