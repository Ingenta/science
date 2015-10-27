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
		try{
			var dataStr = Template.instance().$("#etData").val();
			var userData = {};
			if(dataStr){
				userData = JSON.parse(dataStr);
			}
			JET.previewData.set(userData);
			JET.compile();
		}catch(e){
			sweetAlert("Error","json格式有误:\n"+ e.message,"error");
		}
	},
	'click .save':function(e){
		var dataStr = Template.instance().$("#etData").val();
		var userData ;
		JET.name=Template.instance().$("#etName").val();
		JET.description=Template.instance().$("#etDescription").val();
		if(dataStr){
			try{
				userData = JSON.parse(dataStr);
			}catch(e){
				sweetAlert("Error","json格式有误:\n"+ e.message,"error");
				return;
			}
			JET.previewData.set(userData);
			JET.save();
		}else{
			JET.sweetConfirm("Warning","您确定不填写样例数据吗？",function(){
				JET.previewData.set({});
				JET.save();
			});
		}

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
						if(obj.previewData){
							instance.$("#etData").val(JSON.stringify(obj.previewData));
						}
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