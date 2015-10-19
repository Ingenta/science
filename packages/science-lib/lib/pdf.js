var execFile = Npm.require('child_process').execFile;
var pdfjar = process.cwd()+"/assets/app/pdf.jar";
//var pdfjar="/Users/jiangkai/Desktop/pdf.jar";
Science.Pdf = Meteor.wrapAsync(function execute(args, callback) {
	var argArr = _.union(["-jar",pdfjar],args);
	execFile('java', argArr, {encoding: 'utf-8', maxBuffer: 1024 * 1000}, function pdfCallback(error, stdout, stderr) {
		if (error) {
			if (error.code === "ENOENT")
				callback('Could not find pdf.jar executable');
			else
				callback(error);
		} else {
			callback(null, new Buffer(stdout, 'binary'), new Buffer(stderr, 'binary'));
		}
	});
});