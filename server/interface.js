//Router.route('/api', function () {
//    var req = this.request;
//    var res = this.response;
//res.write("query:\n");
//req.query["aa"]
//_.each(req.query, function (item) {
//    res.write(item + "\n");
//});
//res.write("form:\n");
//var keyArray = Object.keys(req.body);
//if(!keyArray.length) return res.end('Failed\n');
//_.each(keyArray, function (item) {
//    if (!req.body[item]) {
//        return res.end('Failed\n');
//    }
//    res.write(item + ":" + req.body[item] + "\n");
//});
//Configure.insert({
//    ftpName: 1,
//    port: 21,
//    userName: 1,
//    password: 1,
//    filePath: 1
//});
//res.end('Success\n');

//callFtp('192.168.0.238', "ftpuser", "123123",'00.jpg','/Users/jiangkai/Temp/00.jpg');
//
//callFtp('192.168.0.238', "ftpuser", "123123",'01.jpg','/Users/jiangkai/Temp/01.jpg');
//callFtp('192.168.0.238', "ftpuser", "123123",'02.jpg','/Users/jiangkai/Temp/02.jpg');
//callFtp('192.168.0.238', "ftpuser", "123123",'03.jpg','/Users/jiangkai/Temp/03.jpg');
//callFtp('192.168.0.238', "ftpuser", "123123",'04.jpg','/Users/jiangkai/Temp/04.jpg');
//callFtp('192.168.0.238', "ftpuser", "123123",'05.jpg','/Users/jiangkai/Temp/05.jpg');
//}, {where: 'server'});
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
	var targetPath     = Config.ftp.downloadDir + sourcePath.substr(sourcePath.lastIndexOf("/"));
	callFtp(req.body, targetPath);

}, {where: 'server'});

