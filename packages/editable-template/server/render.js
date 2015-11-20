JET.reCompile=function(name,content){
	SSR.compileTemplate(name, content);
};

JET.render = function (name, data) {
	data = data || {};
	if (!Template[name]) {
		logger.error("Email Template not found:"+ name)
		return "Email Template not found:"+ name;
	}
	if(!data && Config.isDevMode){
		var tempObj = JET.store.findOne({name: name});
		data = tempObj.previewData;
	}
	var html = SSR.render(name, data);
	return html;
}