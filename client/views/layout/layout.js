Template.layout.rendered = function () {
	moment.locale(navigator.language);
	// scroll to anchor
	$('body').on('click', 'a', function (e) {
		var href = $(this).attr("href");
		if (!href) {
			return;
		}
		if (href.length > 1 && href.charAt(0) == "#") {
			var hash = href.substring(1);
			if (hash) {
				e.preventDefault();
				Science.dom.scollToElement("#"+hash);
			}
		} else {
			if (href.indexOf("http://") != 0 && href.indexOf("https://") != 0 && href.indexOf("#") != 0) {
				$('html,body').scrollTop(0);
			}
		}
	});
	/*TEMPLATE_RENDERED_CODE*/
};


Template.LeftMenu.rendered = function () {
	$(".menu-item-collapse .dropdown-toggle").each(function () {
		if ($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function () {
			if ($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});


};

Template.LeftMenu.events({});

Template.LeftMenu.helpers({});

Template.PublicLayoutRightMenu.rendered = function () {
	$(".menu-item-collapse .dropdown-toggle").each(function () {
		if ($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function () {
			if ($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});


};

Template.layout.helpers({
	developerModeEnabled:function(){
		return Meteor.isDevelopment;
	}
});

