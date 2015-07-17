Router.route('/api', function () {
	var req            = this.request;
	var res            = this.response;
	var NonEmptyString = Match.Where(function (x) {
		check(x, String);
		return x.length > 0;
	});
	check(req.body, {
		user      : NonEmptyString,
		password  : NonEmptyString,
		host      : NonEmptyString,
		sourcePath: NonEmptyString
	});
	var slashLoc       = req.body.sourcePath.lastIndexOf("/")+1;
	var filename       = slashLoc == 0 ? req.body.sourcePath : req.body.sourcePath.substr(slashLoc);
	var targetPath     = Config.ftp.downloadDir + "/" + filename;
	console.log("download:"+targetPath);

	var downloadCallback = function(err){
		res.writeHead(200,{
			'Content-Type': 'applications/json'
		});
		var result = {};
		if(err){
			result.result="failed";
			result.message=err.message;
		}else{
			result.result="success";
		}
		res.write(JSON.stringify(result));


		Tasks.startJob(targetPath,filename,"application/zip");
		res.end();
	};

	(new FTP()).getSingleFile(req.body, targetPath, Meteor.bindEnvironment(downloadCallback));

}, {where: 'server'});