juice=Npm.require("juice");

JET.render=function(name, options){
	options = options || {};
	var tempObj = JET.store.findOne({name:name});
	if(!tempObj)
		return;
	SSR.compileTemplate(tempObj.name,tempObj.content);
	var html = SSR.render(tempObj.name,options.data || tempObj.previewData);
	if(options.css)
		html= juice.inlineContent(html,options.css);
	return html;
}