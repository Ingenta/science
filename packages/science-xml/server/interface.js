Router.route('/api', function () {
    var req = this.request;
    var res = this.response;
    var result = {};


    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    if (req.method !== 'POST' && req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
        result.result = "failed";
        result.message = "wrong method, please use POST method with 'x-www-form-urlencoded'";
        res.write(JSON.stringify(result));
        res.end();
        return;
    }
    console.log("api requesting: " + JSON.stringify(req.body));
    console.log("api called by: " + JSON.stringify(req.headers));
    var NonEmptyString = Match.Where(function (x) {
        check(x, String);
        return x.length > 0;
    });
    try {
        check(req.body, {
            user: NonEmptyString,
            password: NonEmptyString,
            host: NonEmptyString,
            sourcePath: NonEmptyString,
            type: Match.OneOf("normal", "accepted", "online_first")
        });
    } catch (e) {
        result.result = "failed";
        result.message = e.message;
        res.write(JSON.stringify(result));
        res.end();
        return;
    }

    var filename = Science.String.getFileName(req.body.sourcePath);
    var targetPath = Config.ftp.downloadDir + "/" + filename;
    ScienceXML.FolderExists(Config.ftp.downloadDir);
    var downloadCallback = function (err) {
        if (err) {
            result.result = "failed";
            result.message = err.message;
        } else {
            result.result = "job started";
            importQueue.add({
                pathToFile: targetPath,
                fileName: filename,
                fileType: "application/zip",
                formFields: {creator: "api", pubStatus: req.body.type}
            })
        }
        res.write(JSON.stringify(result));

        res.end();
    };
    Science.FTP.getSingleFile(req.body, targetPath, Meteor.bindEnvironment(downloadCallback));

}, {where: 'server'});

Router.route('downloadXml', {
    where: 'server',
    path: '/xml/:doiPartOne/:doiPartTwo',
    action: function () {
        var fullDoi = this.params.doiPartOne + "/" + this.params.doiPartTwo.replace(/-slash-/g,"/");
        var art = Articles.findOne({doi: fullDoi}, {fields: {_id: 1}});
        if (!art) {
            this.response.writeHead(400);
            return this.response.end("Not Found");
        }
        var log = UploadLog.findOne({articleId: art._id}, {sort: {uploadedAt: -1}}, {fields: {xml: 1}});
        if (!log.xml || !Science.FSE.existsSync(log.xml)) {
            this.response.writeHead(400);
            return this.response.end("File Not Found");
        }
        var text = Science.FSE.readFileSync(log.xml, "utf8");
        var filename = this.params.doiPartTwo + '.xml';

        var headers = {
            'Content-Type': 'text/xml',
            'Content-Disposition': "inline; filename=" + filename
        };

        this.response.writeHead(200, headers);
        return this.response.end(text);
    }
})
