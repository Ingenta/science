/**
 * Created by jiangkai on 15/10/21.
 */
'use strict'
Template.etEditor.onRendered(function(){
	JET.dataEditor=CodeMirror.fromTextArea(this.find("#etData"), {
		lineNumbers: true,
		mode: "javascript" // set any of supported language modes here
	});
	JET.templateEditor=CodeMirror.fromTextArea(this.find("#etTemplate"), {
		lineNumbers: true,
		mode: "handlebars" // set any of supported language modes here
	});
})

var getOptions = function(e,t){
	var options={};
	var dataStr = JET.dataEditor.getValue();
	var userData ;
	options.name=t.find("#etName").value;
	options.description=t.find("#etDescription").value;
	if(dataStr){
		try{
			userData = JSON.parse(dataStr);
		}catch(err){
			sweetAlert("Error","json格式有误:\n"+ err.message,"error");
			return;
		}
		Session.set("etData",userData);
		options.previewData=userData;
	}
	options.content=JET.templateEditor.getValue().trim();
	return options;
};

Template.etEditor.events({
	'click .preview':function(e,t){
		var options = getOptions(e,t);
		JET.preview(options);
	},
	'click .save':function(e,t){
		var options = getOptions(e,t);
		JET.save(options);
	},
	'keyup #etName':function(e,t){
		var inputName = t.find("#etName").value;
		if(JET.verifyName(inputName) && inputName !== JET.name){
			var obj = JET.store.findOne({name:inputName});
			if(obj){
				t.find("#etDescription").value=obj.description;
				if(obj.previewData){
					JET.dataEditor.setValue(JSON.stringify(obj.previewData));
				}
				JET.templateEditor.setValue(obj.content);
			}else{
				t.find("#etDescription").value="";
				JET.dataEditor.setValue("");
				JET.templateEditor.setValue("");
			}
		}
	}
});