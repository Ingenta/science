juice = Npm.require("juice");

JET.reCompile=function(name,content){
	SSR.compileTemplate(name, content);
};

JET.render = function (name, options) {
	options = options || {};
	if (!Template[name]) {
		return "Tempalte not found:"+ name;
	}
	if(!options.data && Config.isDevMode){
		var tempObj = JET.store.findOne({name: name});
		options.data = tempObj.previewData;
	}
	var html = SSR.render(name, options.data);
	if (options.css)
		html = juice.inlineContent(html, options.css);
	return html;
}