Science.dom = {};

Science.dom.getSelContent = function(){
	if (document.selection) {
		return document.selection.createRange().text;	// IE
	} else {
		return document.getSelection().toString();
	}
}