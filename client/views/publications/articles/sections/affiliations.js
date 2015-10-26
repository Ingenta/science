Template.affiliation.helpers({
	formatId:function(){
		var idObj = /\d+/g.exec(this.id);
		return !_.isEmpty(idObj) && idObj[0]+".";
	}
})