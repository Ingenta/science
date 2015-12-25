this.publisherPanelController = RouteController.extend({
	template: "publisherPanel",

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		this.redirect('publisher.account', {pubId: this.params.pubId, query: 'level=normal'});
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {


		return {
			params: this.params || {}
		};
		/*DATA_FUNCTION*/
	}
});