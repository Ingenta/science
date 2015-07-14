Router.route('/api', function () {
    var req = this.request;
    var res = this.response;
    res.write("query:\n");
    //req.query["aa"]
    _.each(req.query, function (item) {
        res.write(item + "\n");
    });
    res.write("form:\n");
    var keyArray = Object.keys(req.body);
    //if(!keyArray.length) return res.end('Failed\n');
    _.each(keyArray, function (item) {
        if (!req.body[item]) {
            return res.end('Failed\n');
        }
        res.write(item + ":" + req.body[item] + "\n");
    });
    //Configure.insert({
    //    ftpName: 1,
    //    port: 21,
    //    userName: 1,
    //    password: 1,
    //    filePath: 1
    //});
    res.end('Success\n');
    
    callFtp('ftp.itjls.com', "ftpuser", "scp2015",'1.4788933.zip','C:\\xml\\1.4788933.zip');
}, {where: 'server'});

var callFtp = function (host, user, password, sourcePath, targetPath) {
    var fs = FSE;
    var c = new FTP();

    c.on('ready', function () {
        c.size(sourcePath, function (err, res) {
            if (err) throw err;
            var originalSize = res;
            c.get(sourcePath, function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    c.end();
                    var downloadedSize = fs.statSync(targetPath).size;
                    console.log(originalSize);
                    console.log(downloadedSize)
                    if (originalSize === downloadedSize)console.log("its ok");
                    if (originalSize !== downloadedSize)console.log("its broken do not continue");
                });
                stream.on('error', function (err) {
                    console.log(err);
                    throw  err;
                });
                stream.pipe(fs.createWriteStream(targetPath));
            });
        });

    });

    c.connect(
        {
            host: 'ftp.itjls.com',
            user: "ftpuser",
            password: "scp2015"
        }
    );
};