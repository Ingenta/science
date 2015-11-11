/**
 * Created by jiangkai on 15/10/21.
 */

JET.compile = function (name,content) {
	var result = false;
	try {
		if (!content) {
			sweetAlert("Compile failed", "Please fill some thing into the editor", "error");
			return;
		}
		var compiledStr = SpacebarsCompiler.compile(content, {
			isTemplate: true
		});

		delete Template[name];
		Template.__define__(name, eval(compiledStr));
		result          = true;
	} catch (e) {
		sweetAlert("Compile failed", e.message, "error");
		throw e;
	}
	return result;
};

JET.preview=function(options){
	JET.compile(JET.tempName,options.content);
	Session.set("etTemplate",options.content);
};

JET.save = function (options) {
	var verifyData = function(){
		if(_.isEmpty(options.previewData)){
			JET.sweetConfirm("Warning","您确定不填写示例数据吗？",function(){
				doSave(options);
			});
		}else{
			doSave(options);
		}
	};
	var doSave=function(obj){
		if (JET.compile(obj.name,obj.content)) {
			var existObj=JET.store.findOne({name:obj.name});
			if(existObj){
				JET.store.update({_id:existObj._id},{$set:obj});
			}else{
				JET.store.insert(obj);
			}
			sweetAlert("Saved successfully","保存成功！", "success");
		}
	}
	if(!JET.verifyName(options.name,"empty")){
		sweetAlert("Save Failed","please set a name for the template","error");
		return;
	}
	if(!JET.verifyName(options.name,"reg")){
		sweetAlert("Save Failed","模板名称只能包含半角英文字母、数字及下划线，且必须以英文字母开头","error");
		return;
	}
	if(options.description===""){
		JET.sweetConfirm("Warning","您没有设置模板介绍信息",function(){
			verifyData();
		});
	}else{
		verifyData();
	}
};

JET.sweetConfirm = function(title,text,callback){
	sweetAlert({
		title             : title,
		text              : text,
		type              : "warning",
		showCancelButton  : true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText : "Yes",
		cancelButtonText  : "Cancel",
		closeOnConfirm    : true
	}, function () {
		callback && callback();
	});
}