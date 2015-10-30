/**
 * Created by jiangkai on 15/10/21.
 */
Template.etPreview.helpers({
	getTemplate:function(){
		var temp = JET.previewTemplate.get();
		return temp?JET.tempName:"_etStart";
	},
	getData:function(){
		return JET.previewData.get();
	}
})