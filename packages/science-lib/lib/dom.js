Science.dom = {};

Science.dom.getSelContent = function () {
	if (document.selection) {
		return document.selection.createRange().text;	// IE
	} else {
		return document.getSelection().toString();
	}
}

Science.dom.scollToElement = function (selector) {
	var ele = $(selector);
	var top = ele.length ? ele.offset().top : 0;
	$('html,body').animate({scrollTop: top}, 400);
}

var select2keeper = [];

Science.dom.recordSelect2 = function (entity) {
	if (entity.data("select2"))
		select2keeper.push(entity.data("select2"));
};

Science.dom.clearSelect2Record = function () {
	if (_.isEmpty(select2keeper))
		return;
	_.each(select2keeper, function (item) {
		item.destroy && item.destroy()
	})
	select2keeper = [];
}

Science.dom.confirm = function(title,content,callback){
	sweetAlert({
		title             : title,
		text              : content,
		type              : "warning",
		showCancelButton  : true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText : "Yes",
		cancelButtonText  : "Cancel",
		closeOnConfirm    : true
	}, function () {
		callback && callback();
	});
}