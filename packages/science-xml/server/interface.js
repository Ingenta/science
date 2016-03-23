Router.route('/api', function () {
	var req            = this.request;
	var res            = this.response;
	var result = {};




	res.writeHead(200,{
		'Content-Type': 'application/json; charset=utf-8'
	});
	if(req.method !=='POST' && req.headers.content-type!=='application/x-www-form-urlencoded'){
		result.result="failed";
		result.message="wrong method, please use POST method with 'x-www-form-urlencoded'";
		res.write(JSON.stringify(result));
		res.end();
		return;
	}
	console.log("api requesting: "+JSON.stringify(req.body));
	console.log("api called by: "+JSON.stringify(req.headers));
	var NonEmptyString = Match.Where(function (x) {
		check(x, String);
		return x.length > 0;
	});
	try{
		check(req.body, {
			user      : NonEmptyString,
			password  : NonEmptyString,
			host      : NonEmptyString,
			sourcePath: NonEmptyString,
			type	  : NonEmptyString
		});
	}catch(e){
		result.result="failed";
		result.message="miss params";
		res.write(JSON.stringify(result));
		res.end();
		return;
	}

	var slashLoc       = req.body.sourcePath.lastIndexOf("/")+1;
	var filename       = slashLoc == 0 ? req.body.sourcePath : req.body.sourcePath.substr(slashLoc);
	var targetPath     = Config.ftp.downloadDir + "/" + filename;
	//TODO: fix this if its false it doesn't do anything!
	ScienceXML.FolderExists(Config.ftp.downloadDir);
	var downloadCallback = function(err){
		if(err){
			result.result="failed";
			result.message=err.message;
		}else{
			result.result="success";
			Tasks.startJob(targetPath,filename,"application/zip",{creator:"api",pubStatus:req.body.type});
		}
		res.write(JSON.stringify(result));

		res.end();
	};
	Science.FTP.getSingleFile(req.body, targetPath, Meteor.bindEnvironment(downloadCallback));

}, {where: 'server'});