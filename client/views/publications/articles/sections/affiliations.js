Template.affiliation.helpers({
	formatId:function(){
		if(Session.get("hideAffLabel"))
			return;
		var idObj = /\d+/g.exec(this.id);
		return !_.isEmpty(idObj) && idObj[0]+".";
	}
})