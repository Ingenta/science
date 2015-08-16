Template.jkafModal.helpers({
	class:function(){
		return Template.currentData().class || "fa fa-pencil";
	}
});

Template.jkafModal.events({
	'click':function(e){
		e.preventDefault();
		Session.set("jkafTemplate",Template.currentData().template)
		Session.set("jkafDoc",Template.currentData().doc)
		AutoForm.addHooks(Template.currentData().id,{
			onSuccess: function () {
				$("#jkafModal").modal('hide');
			}
		});
		$('#jkafModal').modal('show')
	}
});


Template.jkautoformModals.helpers({
	template:function(){
		return Session.get("jkafTemplate")
	},
	doc:function(){
		return Session.get("jkafDoc");
	}
})