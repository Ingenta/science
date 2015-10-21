/**
 * Created by jiangkai on 15/10/21.
 */
'use strict'

Template.etEditor.onRendered(function(){
	var container = Template.instance().$("#editorContainer");
	container.summernote({
		height: 300,
		lang: "zh-CN"//not work
	});
});

Template.etEditor.events({
	'click .preview':function(e){
		var content = Template.instance().$("#editorContainer").code();
		if(!content){
			console.log('nothing found');
			return
		}

		JET.previewTemplate.set(content);
		delete Template["_previewEditableTemplate"];
		Template.__define__('_previewEditableTemplate', eval(SpacebarsCompiler.compile(content, {
			isTemplate: true
		})));
	}
})