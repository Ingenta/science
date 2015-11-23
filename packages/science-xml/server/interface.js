Router.route('/api', function () {
	var req            = this.request;
	var res            = this.response;
	var result = {};
	res.writeHead(200,{
		'Content-Type': 'applications/json'
	});
	if(req.method !=='POST'){
		result.result="failed";
		result.message="wrong method, please use POST method with 'x-www-form-urlencoded'";
		res.write(JSON.stringify(result));
		res.end();
		return;
	}
	var NonEmptyString = Match.Where(function (x) {
		check(x, String);
		return x.length > 0;
	});
	try{
		check(req.body, {
			user      : NonEmptyString,
			password  : NonEmptyString,
			host      : NonEmptyString,
			sourcePath: NonEmptyString
		});
	}catch(e){
		result.result="failed";
		result.message="miss params";
		res.write(JSON.stringify(result));
		res.end();
	}

	var slashLoc       = req.body.sourcePath.lastIndexOf("/")+1;
	var filename       = slashLoc == 0 ? req.body.sourcePath : req.body.sourcePath.substr(slashLoc);
	var targetPath     = Config.ftp.downloadDir + "/" + filename;
	ScienceXML.FolderExists(Config.ftp.downloadDir);
	var downloadCallback = function(err){
		if(err){
			result.result="failed";
			result.message=err.message;
		}else{
			result.result="success";
			Tasks.startJob(targetPath,filename,"application/zip");
		}
		res.write(JSON.stringify(result));

		res.end();
	};
	Science.FTP.getSingleFile(req.body, targetPath, Meteor.bindEnvironment(downloadCallback));

}, {where: 'server'});