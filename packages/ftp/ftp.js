FTP = Npm.require('ftp');
FSE = Npm.require('fs-extra');

Science.FTP = {};

Science.FTP.getSingleFile = function (options, targetFile, callback) {
	var self = new FTP()
	var originalSize;

	var streamClose = function () {
		var downloadedSize = FSE.statSync(targetFile).size;
		var err;
		if (originalSize !== downloadedSize)
			err = new Error("size error");
		self.end();
		if(err){
			Science.FTP.getSingleFile(options, targetFile, callback);
		}else{
			callback && callback(err);
		}
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

	var ontimeout = function(e){
		callback && callback(e);
		self.end();
	};

	self.on('ready', onready);
	self.on('error',ontimeout);

	self.connect({
		host    : options.host,
		user    : options.user,
		password: options.password,
		connTimeout:2000,
		pasvTimeout:2000
	});
};

Science.FTP.listFiles=function(options,callback){
	var self = new FTP();
	var _listFiles=function(){
		self.list(function(err, list) {
			if (err) {
				callback && callback(err);
				return;
			}
			var fileList=[];
			if(options.ext){
				fileList =  _.filter(list,function(item){
					return item.name.toLowerCase().endWith(options.ext)
				})
			}else{
				fileList=list;
			}
			self.end();
			callback(null,fileList);
		});
	}
	self.on("ready",function(){
		if(options.targetFolder){
			self.cwd(options.targetFolder,function(err,currentWorkDir){
				_listFiles();
			})
		}else{
			_listFiles();
		}
	});
	self.on('error', function(e){
		callback && callback(e);
		self.end();
	});
	self.connect({
		host    : options.host,
		user    : options.user,
		password: options.password,
		connTimeout:2000,
		pasvTimeout:2000
	});
}

Science.FTP.moveFtpFiles = function(options,callback){
	var self = new FTP();
	self.on("ready",function(){
		self.rename(options.oldPath,options.newPath,function(err){
			if (err) {
				callback && callback(err);
				return;
			}
		})
	});
	self.on('error', function(e){
		callback && callback(e);
		self.end();
	});
	self.connect({
		host    : options.host,
		user    : options.user,
		password: options.password,
		connTimeout:2000,
		pasvTimeout:2000
	});
}