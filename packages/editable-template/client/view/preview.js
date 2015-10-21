/**
 * Created by jiangkai on 15/10/21.
 */
Template.etPreview.helpers({
	getTemplate:function(){
		var temp = JET.previewTemplate.get();
		if(!temp){
			console.log('nothing found');
			return
		}else{
			return "_previewEditableTemplate";
		}
	},
	getData:function(){
		return {name:"jack",recentRead:["java编程思想", "javascript权威指南", "meteor入门"]};
	}
})