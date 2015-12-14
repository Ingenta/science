var cmOnSuccessCallback, collectionObj, defaultFormId, helpers, registeredAutoFormHooks;

registeredAutoFormHooks = ['cmForm'];

defaultFormId = 'cmForm';

cmOnSuccessCallback = null;

AutoForm.addHooks('cmForm', {
	onSuccess: function() {
		return $('#afModal').modal('hide');
	}
});

collectionObj = function(name) {
	return name.split('.').reduce(function(o, x) {
		return o[x];
	}, window);
};

Template.autoformModals.rendered = function() {
	var onEscKey;
	$('#afModal').modal({
		show: false
	});
	onEscKey = function(e) {
		if (e.keyCode === 27) {
			return $('#afModal').modal('hide');
		}
	};
	$('#afModal').on('shown.bs.modal', function() {
		return $(window).bind('keyup', onEscKey);
	});
	$('#afModal').on('show.bs.modal', function() {
		AutoForm.resetForm(Session.get('cmFormId') || defaultFormId);
	});
	$('#afModal').on('hidden.bs.modal', function() {
		var i, key, len, results, sessionKeys;
		$(window).unbind('keyup', onEscKey);
		AutoForm.resetForm(Session.get('cmFormId') || defaultFormId);
		sessionKeys = ['cmCollection', 'cmOperation', 'cmDoc', 'cmButtonHtml', 'cmFields', 'cmOmitFields', 'cmButtonContent', 'cmTitle', 'cmButtonClasses', 'cmPrompt', 'cmTemplate', 'cmLabelClass', 'cmInputColClass', 'cmPlaceholder', 'cmFormId', 'cmAutoformType', 'cmMeteorMethod', 'cmCloseButtonContent', 'cmCloseButtonClasses'];
		results = [];
		for (i = 0, len = sessionKeys.length; i < len; i++) {
			key = sessionKeys[i];
			results.push(delete Session.keys[key]);
		}
		return results;
	});
};

Template.autoformModals.events({
	'click button:not(.close)': function() {
		var _id, collection, operation;
		collection = Session.get('cmCollection');
		operation = Session.get('cmOperation');
		if (operation !== 'insert') {
			_id = Session.get('cmDoc')._id;
		}
		if (operation === 'remove') {
			return collectionObj(collection).remove(_id, function(e) {
				if (e) {
					return alert('Sorry, this could not be deleted.');
				} else {
					$('#afModal').modal('hide');
					return typeof cmOnSuccessCallback === "function" ? cmOnSuccessCallback() : void 0;
				}
			});
		}
	}
});

helpers = {
	cmCollection: function() {
		return Session.get('cmCollection');
	},
	cmOperation: function() {
		return Session.get('cmOperation');
	},
	cmDoc: function() {
		return Session.get('cmDoc');
	},
	cmButtonHtml: function() {
		return Session.get('cmButtonHtml');
	},
	cmFields: function() {
		return Session.get('cmFields');
	},
	cmOmitFields: function() {
		return Session.get('cmOmitFields');
	},
	cmButtonContent: function() {
		return Session.get('cmButtonContent');
	},
	cmCloseButtonContent: function() {
		return Session.get('cmCloseButtonContent');
	},
	cmTitle: function() {
		return Session.get('cmTitle');
	},
	cmButtonClasses: function() {
		return Session.get('cmButtonClasses');
	},
	cmCloseButtonClasses: function() {
		return Session.get('cmCloseButtonClasses');
	},
	cmPrompt: function() {
		return Session.get('cmPrompt');
	},
	cmTemplate: function() {
		return Session.get('cmTemplate');
	},
	cmLabelClass: function() {
		return Session.get('cmLabelClass');
	},
	cmInputColClass: function() {
		return Session.get('cmInputColClass');
	},
	cmPlaceholder: function() {
		return Session.get('cmPlaceholder');
	},
	cmFormId: function() {
		return Session.get('cmFormId') || defaultFormId;
	},
	cmAutoformType: function() {
		if (Session.get('cmMeteorMethod')) {
			return 'method';
		} else {
			return Session.get('cmOperation');
		}
	},
	cmMeteorMethod: function() {
		return Session.get('cmMeteorMethod');
	},
	title: function() {
		return StringTemplate.compile('{{{cmTitle}}}', helpers);
	},
	prompt: function() {
		return StringTemplate.compile('{{{cmPrompt}}}', helpers);
	},
	buttonContent: function() {
		return StringTemplate.compile('{{{cmButtonContent}}}', helpers);
	},
	closeButtonContent: function() {
		return StringTemplate.compile('{{{cmCloseButtonContent}}}', helpers);
	}
};

Template.autoformModals.helpers(helpers);

Template.afModal.events({
	'click *': function(e, t) {
		var html;
		e.preventDefault();
		html = t.$('*').html();
		Session.set('cmCollection', t.data.collection);
		Session.set('cmOperation', t.data.operation);
		Session.set('cmFields', t.data.fields);
		Session.set('cmOmitFields', t.data.omitFields);
		Session.set('cmButtonHtml', html);
		Session.set('cmTitle', t.data.title || html);
		Session.set('cmTemplate', t.data.template);
		Session.set('cmLabelClass', t.data.labelClass || t.data['label-class']);
		Session.set('cmInputColClass', t.data.inputColClass || t.data['input-col-class']);
		Session.set('cmPlaceholder', t.data.placeholder === true ? 'schemaLabel' : '');
		Session.set('cmFormId', t.data.formId);
		Session.set('cmMeteorMethod', t.data.meteormethod);
		cmOnSuccessCallback = t.data.onSuccess;
		if (!_.contains(registeredAutoFormHooks, t.data.formId)) {
			AutoForm.addHooks(t.data.formId, {
				onSuccess: function() {
					return $('#afModal').modal('hide');
				}
			});
			registeredAutoFormHooks.push(t.data.formId);
		}
		if (t.data.doc) {
			Session.set('cmDoc', collectionObj(t.data.collection).findOne({
				_id: t.data.doc
			}));
		}
		if (t.data.buttonContent) {
			Session.set('cmButtonContent', t.data.buttonContent);
		} else if (t.data.operation === 'insert') {
			Session.set('cmButtonContent', 'Create');
		} else if (t.data.operation === 'update') {
			Session.set('cmButtonContent', 'Update');
		} else if (t.data.operation === 'remove') {
			Session.set('cmButtonContent', 'Delete');
		}
		if (t.data.buttonClasses) {
			Session.set('cmButtonClasses', t.data.buttonClasses);
		} else if (t.data.operation === 'remove') {
			Session.set('cmButtonClasses', 'btn btn-danger');
		} else {
			Session.set('cmButtonClasses', 'btn btn-primary');
		}
		Session.set('cmCloseButtonContent', t.data.closeButtonContent || '');
		Session.set('cmCloseButtonClasses', t.data.closeButtonClasses || 'btn btn-default');
		if (t.data.prompt) {
			Session.set('cmPrompt', t.data.prompt);
		} else if (t.data.operation === 'remove') {
			Session.set('cmPrompt', 'Are you sure?');
		} else {
			Session.set('cmPrompt', '');
		}
		$('#afModal').data('bs.modal').options.backdrop = t.data.backdrop || true;
		return $('#afModal').modal('show');
	}
});