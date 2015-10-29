JET.store.after.insert(function (userId, doc) {
	JET.reCompile(doc.name,doc.content);
});

JET.store.after.update(function (userId, doc, fieldNames, modifier) {
	if(modifier.$set.content){
		JET.reCompile(doc.name,modifier.$set.content);
	}
});

JET.store.after.remove(function(userId,doc){
	delete Template[doc.name];
})