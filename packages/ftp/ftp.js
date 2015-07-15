FTP = Npm.require('ftp');
FSE = Npm.require('fs-extra');

FTP.prototype.getSingleFile = function (options, targetFile, callback) {
	var client = new FTP();

	client.on('ready', function () {
		client.size(options.sourcePath, function (err, res) {
			if (err) throw err;
			var originalSize = res;
			client.get(options.sourcePath, function (err, stream) {
				if (err) throw err;
				stream.on('close', function () {
					client.end();
					var downloadedSize = FSE.statSync(targetFile).size;
					console.log(originalSize);
					if (originalSize === downloadedSize)console.log("its ok");
					if (originalSize !== downloadedSize)console.log("its broken do not continue");
				});
				stream.on('error', function (err) {
					console.log(err);
					throw  err;
				});
				stream.pipe(FSE.createWriteStream(targetFile));
			});
		});
	});

	client.connect({
		host    : options.host,
		user    : options.user,
		password: options.password
	});
};