Template.affiliation.helpers({
	formatId:function(){
		if(Session.get("hideAffLabel"))
			return;
		var idObj = /\d+/g.exec(this.id);
		var numInId = !_.isEmpty(idObj) && idObj[0];
		return Science.JSON.try2GetRightLangVal(this.label,null,TAPi18n.getLanguage()) || numInId
	},
	formatAddr:function(){
		var label=Science.JSON.try2GetRightLangVal(this.label,null,TAPi18n.getLanguage());
		var affText = Science.JSON.try2GetRightLangVal(this.affText,null,TAPi18n.getLanguage());
		if(affText)
			if(label && label.length<3 && affText.startWith(label))
				return affText.substr(label.length)
		return affText;
	}
})