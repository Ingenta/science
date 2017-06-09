Meteor.startup(function () {
    if (Meteor.isServer) {
        //确保pdf处理中间过程需要的文件夹存在
        Science.FSE.ensureDir(Config.staticFiles.uploadPdfDir + "/handle/", function (err) {
            if (err)
                throw new Meteor.Error(err);
        });
    }
})
Router.map(function () {
  this.route('articlePage', {
      where: 'server',
      path: '/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue/:publisherDoi/:articleDoi',
    }).get(function(){
      this.response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return this.response.end(
        '<!DOCTYPE html>'
        +'<html lang="en">'
        +'  <head>'
        +'    <meta charset="utf-8">'
        +'    <meta name="author" content="test">'
        +'    <script type="text/javascript" src="/redirct.js"></script>'
        +'  </head>'
        +'</html>'
      )
    });
});
