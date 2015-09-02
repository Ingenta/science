Science.XPath = xpath;

Science.XPath.selectAsJson = function(xp,doc,callback){
	var nodes=Science.XPath.select(xp,doc)
	var text = new serializer().serializeToString(nodes);
	Science.JSON.parseString(text,function(err,result){
		if(!err)
			callback(result);
	})
}