this.publisherPanelController = RouteController.extend({
	template: "publisherPanel",

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(Permissions.userCan("list-user", "user", Meteor.userId(), {publisher: Router.current().params.pubId}))
			this.redirect('publisher.account', {pubId: this.params.pubId, query: 'level=normal'});
		else if(Permissions.userCan("add-article", "resource", Meteor.userId(), {publisher: Router.current().params.pubId}))
			this.redirect('publisher.upload', {pubId: this.params.pubId});
		else
			this.next();
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