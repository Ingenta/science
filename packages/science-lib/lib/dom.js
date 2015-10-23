Science.dom = {};

Science.dom.getSelContent = function(){
	if (document.selection) {
		return document.selection.createRange().text;	// IE
	} else {
		return document.getSelection().toString();
	}
}

Science.dom.scollToElement = function(selector){
	var ele = $(selector);
	var top = ele.length ? ele.offset().top : 0;
	$('html,body').animate({scrollTop: top}, 400);
}