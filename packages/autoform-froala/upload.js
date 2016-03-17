var Busboy = Npm.require("busboy");

Router.onBeforeAction(function (req, res, next) {
    var files = []; // Store filenames and then pass them to request.

    if (req.method === "POST") {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            var folder = Config.staticFiles.uploadFileDir;
            if (req.url=='/upload_froala'){
                folder=Config.staticFiles.uploadPicDir;
            }
            var ext = Science.String.getExt(filename);
            var newname=Date.now()+"."+ext;
            var saveTo = folder+newname;
            file.pipe(Science.FSE.createWriteStream(saveTo));
            files.push({path:saveTo,name:newname,ext:ext,mimetype:mimetype});
        });
        busboy.on("field", function(fieldname, value) {
            console.log('Field [' + fieldname + ']: value: ');
            console.dir(req.body[fieldname]);
            if(_.isEmpty(req)||_.isEmpty(req.body))return;
            req.body[fieldname] = value;
        });
        busboy.on('error', function (error) {
            console.log("Error in uploading file with chunks: "  + error);
        });
        busboy.on("finish", function () {
            // Pass files to request
            req.files = files;
            next();
        });
        // Pass request to busboy
        req.pipe(busboy);
    } else {
        next();
    }
});



Router.route("/upload_froala", {
    name: "upload.froala",
    where: 'server',
    action: function() {
        var file = this.request.files[0];
        var resp=this.response;
        if(file){
            resp.end(JSON.stringify({link:"/uploadfiles/editor/"+file.name}));
        }
        resp.end();
    }
});

Router.route("/upload_froala_file", {
    name: "upload.froala.file",
    where: 'server',
    action: function() {
        var file = this.request.files[0];
        var resp=this.response;
        if(file){
            resp.end(JSON.stringify({link:"/uploadfiles/editorfiles/"+file.name}));
        }
        resp.end();
    }
});

Router.route("/uploadfiles/editor/:filename",{
    name:"upload.image.get",
    where:'server',
    action:function(){
        var filename=this.params.filename;
        var response=this.response;
        Science.FSE.exists(Config.staticFiles.uploadPicDir+ filename, function (result) {
            if (result) {
                var stat = null;
                try {
                    stat = Science.FSE.statSync(Config.staticFiles.uploadPicDir+ filename);
                } catch (_error) {
                    logger.error(_error);
                    response.statusCode = 404;
                    response.end();
                    return;
                }

                var headers = {
                    'Content-Type': "image/png",
                    'Content-Disposition': "inline; filename=" + filename,
                    'Content-Length': stat.size
                };

                response.writeHead(200, headers);

                Science.FSE.createReadStream(Config.staticFiles.uploadPicDir+ filename).pipe(response);
            }
        });
    }
})

Router.route("/uploadfiles/editorfiles/:filename",{
    name:"upload.file.get",
    where:'server',
    action:function(){
        var filename=this.params.filename;
        var response=this.response;
        Science.FSE.exists(Config.staticFiles.uploadFileDir+ filename, function (result) {
            if (result) {
                var stat = null;
                try {
                    stat = Science.FSE.statSync(Config.staticFiles.uploadFileDir+ filename);
                } catch (_error) {
                    logger.error(_error);
                    response.statusCode = 404;
                    response.end();
                    return;
                }

                var headers = {
                    'Content-Type': "application/file",
                    'Content-Disposition': "attachment; filename=" + filename,
                    'Content-Length': stat.size
                };

                response.writeHead(200, headers);

                Science.FSE.createReadStream(Config.staticFiles.uploadFileDir+ filename).pipe(response);
            }
        });
    }
})