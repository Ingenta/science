var pdfStore = new FS.Store.FileSystem("pdfs", {
    path: Config.staticFiles.uploadPdfDir
});

Collections.Pdfs = new FS.Collection("pdfs", {
    stores: [pdfStore]
});


if (Meteor.isServer) {
    function trueFunc(userId) {
        //if (!userId) {
        //	// must be logged in
        //	return false;
        //}

        return true;
    };

    Collections.Pdfs.allow({
        insert: trueFunc,
        update: trueFunc,
        remove: trueFunc,
        download: trueFunc
    });
}