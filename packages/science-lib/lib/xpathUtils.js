Science.XPath = xpath;

//may be problem
Science.XPath.selectAsJson = function(xp,doc,callback){
	var nodes=Science.XPath.select(xp,doc);
	var text = nodes.toString();
	Science.JSON.parseString(text,function(err,result){
		if(!err)
			callback(result);
	})
}