var execFile = Npm.require('child_process').execFile;
var pdfjar = process.cwd()+"/assets/packages/science-lib/pdf.jar";
Science.Pdf = Meteor.wrapAsync(function execute(args, callback) {
	var argArr = _.union(["-jar",pdfjar],args);
	execFile('java', argArr, {encoding: 'utf-8', maxBuffer: 1024 * 1000}, function pdfCallback(error, stdout, stderr) {
		if (error) {
			console.dir(stderr);
		}
		callback(error,stdout,stderr);
	});
});