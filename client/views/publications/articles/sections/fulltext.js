Template.FullTextTemplate.onRendered(function () {
	$('body').scrollspy({
		target: '#section-index'
	});
	$("#sidebar").affix({
		offset: {
			top: function () {
				$("#sidebar").css({"width": $("#section-index").width()});
				return $("#section-index").offset().top - 20;
			}
		}
	});
});
