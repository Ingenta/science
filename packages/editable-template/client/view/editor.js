/**
 * Created by jiangkai on 15/10/21.
 */
'use strict'

Template.etEditor.onRendered(function(){
	JET.editor().summernote({
		height: 200,
		lang: "zh-CN"//not work
	});
});

var getOptions = function(){
	var options={};
	var dataStr = Template.instance().$("#etData").val();
	var userData ;
	options.name=Template.instance().$("#etName").val();
	options.description=Template.instance().$("#etDescription").val();
	if(dataStr){
		try{
			userData = JSON.parse(dataStr);
		}catch(e){
			sweetAlert("Error","json格式有误:\n"+ e.message,"error");
			return;
		}
		JET.previewData.set(userData);
		options.previewData=userData;
	}
	options.content=JET.editor().code().trim();
	return options;
};

Template.etEditor.events({
	'click .preview':function(){
		var options = getOptions();
		JET.preview(options);
	},
	'click .save':function(){
		var options = getOptions();
		JET.save(options);
	},
	'keyup #etName':function(){
		var inputName = Template.instance().$("#etName").val();
		if(JET.verifyName(inputName) && inputName !== JET.name){
			var instance = Template.instance();
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
	}
});