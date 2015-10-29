
JET.compileAll = function(){
	_.each(JET.store.find().fetch(),function(temp){
		if(Meteor.isServer){
			SSR.compileTemplate(temp.name,temp.content);
		}
		if(Meteor.isClient){
			JET.compile(temp.name,temp.content);
		}
	})
};

Meteor.startup(function(){
	JET.compileAll();
})