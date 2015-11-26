Router.route('/ajax/search', function () {
	var req = this.request;
	var res = this.response;
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf-8'
	});
	var params = req.query;
	var result = SolrUtils.search(params);
	res.write(JSON.stringify(result));
	res.end();
},{where:"server"});
