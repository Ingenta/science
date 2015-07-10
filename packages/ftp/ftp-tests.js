Tinytest.add('FTPisDefined', function (test) {
    var isDefined = false;
    try {
        FTP;
        isDefined = true;
    }
    catch (e) {
    }
    test.isTrue(isDefined, "FTP is not defined");
});

Tinytest.add('FSisDefined', function (test) {
    var isDefined = false;
    try {
        FS;
        isDefined = true;
    }
    catch (e) {
    }
    test.isTrue(isDefined, "FS is not defined");
});

Tinytest.add('isConnected', function (test) {
    var c = new FTP();
    c.on('ready', function () {
         c.end();
    });
    c.connect(
        {
            user: "Ingenta",
            password: "123"
        });
//    test.isTrue(c.connected, "Success");
});

Tinytest.add('getaFile', function (test) {
    var fs = FS;
    var c = new FTP();
    c.on('ready', function () {
        c.get('foo.txt', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { c.end(); });
            stream.pipe(fs.createWriteStream('E://foo.local-copy.txt'));
        });
    });
    c.connect(
        {
            user: "Ingenta",
            password: "123"
        });
//    test.isTrue(c.connected, "Success");
});