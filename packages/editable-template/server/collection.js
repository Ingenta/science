console.log('collection~~~~~~~')
console.dir(JET.store.after.insert);

JET.store.before.insert(function (userId, doc) {
	debugger;
	JET.reCompile(doc.name,doc.content);
});

JET.store.after.update(function (userId, doc, fieldNames, modifier) {
	debugger;
	if(modifier["content"]){
		JET.reCompile(doc.name,modifier.content);
	}
});
