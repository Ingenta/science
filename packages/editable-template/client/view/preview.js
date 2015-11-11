/**
 * Created by jiangkai on 15/10/21.
 */
Template.etPreview.helpers({
	getTemplate:function(){
		var temp = Session.get("etTemplate");
		return temp?JET.tempName:"_etStart";
	},
	getData:function(){
		return Session.get("etData");
	}
})