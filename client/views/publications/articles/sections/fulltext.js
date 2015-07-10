Template.FullTextTemplate.onRendered(function(){
	$('body').scrollspy({
		target: '#section-index',
		offset: 0
	});
	$("#sidebar").affix({
		offset: {
			top: 700
		}
	});
});
