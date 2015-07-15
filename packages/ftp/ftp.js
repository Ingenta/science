FTP = Npm.require('ftp');
FSE = Npm.require('fs-extra');

FTP.prototype.getSingleFile = function (options, targetFile, callback) {
	var self = this;
	var originalSize;

	var streamClose = function () {
		var downloadedSize = FSE.statSync(targetFile).size;
		var err;
		if (originalSize !== downloadedSize)
			err = new Error("size error");
		self.end();
		callback && callback(err);
	};
	var streamError = function (err) {
		if (err) {
			callback && callback(err);
		}
	};

	var onget = function (err, stream) {
		if (err) {
			callback && callback(err);
			return false;
		}
		stream.on('close', streamClose);
		stream.on('error', streamError);
		stream.pipe(FSE.createWriteStream(targetFile));
	};

	var onsize = function (err, res) {
		if (err) {
			callback && callback(err);
			return false;
		}
		originalSize = res;
		self.get(options.sourcePath, onget);
	};

	var onready = function () {
		self.size(options.sourcePath, onsize);
	};

	self.on('ready', onready);

	self.connect({
		host    : options.host,
		user    : options.user,
		password: options.password
	});
};