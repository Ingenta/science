Router.route('/ajax/search', function () {
	var req = this.request;
	var res = this.response;
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf-8'
	});
	var params = req.query;
	_.each(params,function(v,k){
		params[k] = JSON.parse(v)
	})
	params.st = params.st || {start:0,rows:10};
	if(params.page){
		params.st.start=params.page * 10;
	}
	var result = SolrUtils.search(params);
	result.page = Math.ceil(result.response.start / 10)
	_.each(result.response.docs,function(item){
		item.id=item._id;
	})
	res.write(JSON.stringify(result));
	res.end();
},{where:"server"});
