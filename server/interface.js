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
    _.each(keyArray, function (item) {
        if (!req.body[item]) {
            return res.end('Failed\n');
        }
        res.write(item + ":" + req.body[item] + "\n");
    });
    res.end('Success\n');
    callFtp();
}, {where: 'server'});

var callFtp = function () {
    var fs = FSE;
    var c = new FTP();

    c.on('ready', function () {
        c.size('1.4788933.zip', function (err, res) {
            if (err) throw err;
            var originalSize = res;
            c.get('1.4788933.zip', function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
//                    console.log('request finished downloading file');
                    c.end();
                    var downloadedSize = fs.statSync('E:\\xml\\1.4788933.zip').size;
                    console.log(originalSize);
                    console.log(downloadedSize)
                    if (originalSize === downloadedSize)console.log("its not fucked");
                    if (originalSize !== downloadedSize)console.log("its fucked");
                });
                stream.on('error', function (err) {
                    console.log(err);
                    throw  err;
                });
                stream.pipe(fs.createWriteStream('E:\\xml\\1.4788933.zip'));
            });
        });

    });

    c.connect(
        {
            user: "Ingenta",
            password: "123"
        }
    );
};