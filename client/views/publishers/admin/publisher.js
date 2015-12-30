Template.PublisherSideMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});
};

Template.PublisherSideMenu.helpers({
	getPublisherId: function () {
		return Router.current().params.pubId;
	}
});