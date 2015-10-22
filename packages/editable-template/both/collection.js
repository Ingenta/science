JET.store=new Meteor.Collection("editable_template");

JET.store.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

if(Meteor.isServer){
	Meteor.publish('oneEditableTemplate', function(name) {
		return JET.store.find({name:name});
	});
}
