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
      var article = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
      var title = article.title.en || article.title.cn;
      var description = "";
      if(article.abstract){
          description = article.abstract.en || article.abstract.cn;
      }
      var publisher = Publishers.findOne({_id:article.publisher});
      var publisherName = "";
      if(publisher){
          publisherName = publisher.name || publisher.chinesename;
      }
      var journal = Publications.findOne({_id:article.journalId});
      var journalName = "";
      if(journal){
          journalName = journal.title || journal.titleCn;
      }
      var published = "";
      if(article.published){
          published = article.published.format("yyyy/MM/dd")
      }
      var firstPage = article.startPage || article.elocationId;
      var author = '';
      var authorMetaTag = [];
      if(!_.isEmpty(article.authors)){
          var authorNames="";
          _.each(article.authors,function(author){
              authorNames+=Science.JSON.try2GetRightLangVal(author.fullname,null,'en')+"|";
              authorMetaTag.push('<meta name="citation_author" content=' + Science.JSON.try2GetRightLangVal(author.fullname,null,'en') + '>\n');
              if(author.email){
                  var email=_.find(article.authorNotes,function(item){
                      return author.email==item.id;
                  })
                  if(email)
                      authorMetaTag.push('<meta name="citation_author_email" content=' + email.email + '>\n')
              }
              if(!_.isEmpty(article.affiliations)){
                  if(_.isEmpty(author.affs)){
                      author.affs="all";
                  }
                  _.each(article.affiliations,function(item){
                      if(author.affs=="all" || _.contains(author.affs,item.id)){
                          var label=Science.JSON.try2GetRightLangVal(item.label,null,'en');
                          var affText = Science.JSON.try2GetRightLangVal(item.affText,null,'en');
                          if(affText)
                              if(label && label.length<3 && affText.startWith(label))
                                  affText= affText.substr(label.length)
                          if(_.isString(affText))
                              authorMetaTag.push('<meta name="citation_author_institution" content=' + affText.trim() + '>\n')
                      }
                  })
              }
          })
          if(authorMetaTag.length > 0)
          var authorArr = authorMetaTag.join(" ");
          if(authorNames){
              authorNames=authorNames.slice(0,-1);
              author = authorNames;
          }
      }
      var htmlHref = Meteor.absoluteUrl() + "doi/" + article.doi;
      var pdfHref = Meteor.absoluteUrl()+"downloadPdf/"+article._id;
      this.response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return this.response.end(
        '<!DOCTYPE html>\n'
        +'<html>\n'
        +'  <head>\n'
        +'    <link rel="stylesheet" type="text/css" class="__meteor-css__" href="/b1507784cc951fd05883029bbe12562ca74ab551.css?meteor_css_resource=true">  <link rel="stylesheet" type="text/css" class="__meteor-css__" href="/d3787456fd39465964aa7d2088a9ee3ba1fdbe47.css?meteor_css_resource=true">\n\n\n'
        +'    <script type="text/javascript">__meteor_runtime_config__ = JSON.parse(decodeURIComponent("%7B%22meteorRelease%22%3A%22METEOR%401.2.1%22%2C%22PUBLIC_SETTINGS%22%3A%7B%7D%2C%22ROOT_URL%22%3A%22http%3A%2F%2Fengine.scichina.com%22%2C%22ROOT_URL_PATH_PREFIX%22%3A%22%22%2C%22autoupdateVersion%22%3A%227c20b022ee6533a292bb49e45bfc10729f6ab3ed%22%2C%22autoupdateVersionRefreshable%22%3A%225ad99d377c38b01b6dc0ab7402502ec8760910ff%22%2C%22autoupdateVersionCordova%22%3A%22none%22%7D"));</script>\n\n'
        +'    <script type="text/javascript" src="/1b1920021f39c46022c75a10b71287cf5490b560.js?meteor_js_resource=true"></script>\n\n'
        +'    <script type="text/javascript" src="/redirct.js"></script>\n\n\n'
        +'    <meta name="fragment" content="!">\n'
        +'    <meta charset="utf-8">\n'
        +'    <meta http-equiv= "X-UA-Compatible" content = "IE=edge,chrome=1">\n'
        +'    <meta name="renderer" content="webkit">\n'
        +'    <meta name="google-site-verification" content="YoQfE59JUfygdO2GC0OLqjidR-HLBAwHwaKBhmcb9gk" />\n'
        +'    <meta name="msvalidate.01" content="040A97EE05E6F2ECE4496950615497A6" />\n'
        +'    <meta name="baidu-site-verification" content="RlyapmbKao" />\n'
        +'    <link href="/favicon.png" type="image/x-icon" rel="icon"/>\n'
        +'    <title>\n'
        +'         《中国科学》杂志社\n'
        +'    </title>\n'
        +'    <meta name="title" content="' + title + '">\n'
        +'    <meta name="author" content="' + author + '">\n'
        +'    <meta name="description" content="' + description + '">\n'
        +'    <meta name="citation_publisher" content="' + publisherName + '">\n'
        +'    <meta name="citation_title" content="' + title + '">\n'
        +'    <meta name="citation_date" content="' + published + '">\n'
        +'    <meta name="citation_doi" content="' + article.doi + '">\n'
        +'    <meta name="citation_abstract" content="' + description + '">\n'
        +'    <meta name="citation_journal_title" content="' + journalName + '">\n'
        +'    <meta name="citation_journal_abbrev" content="' + journal.abbrevTitle + '">\n'
        +'    <meta name="citation_issn" content="' + journal.issn.slice(0, 4) + "-" + journal.issn.slice(4) + '">\n'
        +'    <meta name="citation_eissn" content="' + journal.EISSN + '">\n'
        +'    <meta name="citation_volume" content="' + article.volume + '">\n'
        +'    <meta name="citation_issue" content="' + article.issue + '">\n'
        +'    <meta name="citation_firstpage" content="' + firstPage + '">\n'
        +'    <meta name="citation_lastpage" content="' + article.endPage + '">\n'
        +      authorArr
        +'    <meta name="citation_abstract_html_url" content="' + htmlHref + '">\n'
        +'    <meta name="citation_pdf_url" content="' + pdfHref + '">\n'
        +'  </head>\n'
        +'  <body>\n\n'
        +'  </body>\n'
        +'</html>'
      )
    });
    this.route('PlainText', {
        where: 'server',
        path: '/citation/plaintext/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(!obj){
                this.response.writeHead(302, {'Location': "/"});
                return this.response.end();
            }
            var text = undefined;
            if (obj.language == 1) {
                text = (obj.title.en || obj.title.cn) + "\n";
                if(!_.isEmpty(obj.authors)){
                    obj.authors.forEach(function (author) {
                        text += (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + " and ";
                    });
                }
                text = text.substring(0, text.length - 5);
                text += ", " + (obj.journal.title || obj.journal.titleCn) + ", ";
            } else {
                text = (obj.title.cn || obj.title.en) + "\n";
                if(!_.isEmpty(obj.authors)){
                    obj.authors.forEach(function (author) {
                        text += (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + " and ";
                    });
                }
                text = text.substring(0, text.length - 5);
                text += ", " + (obj.journal.titleCn || obj.journal.title) + ", ";
            }
            text += obj.volume + ", " + obj.elocationId + " (" + obj.year + "), DOI:https://doi.org/" + obj.doi;

            var filename = this.params.articleDoi + '.txt';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    });
    this.route('BibTEX', {
        where: 'server',
        path: '/citation/bibtex/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(!obj){
                this.response.writeHead(302, {'Location': "/"});
                return this.response.end();
            }
            var publisher = Publishers.findOne({_id: obj.publisher});
            var name1 = "publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "@article{:/" + name1 + ",\n   author = \"";
            if (obj.language == 1) {
                if(!_.isEmpty(obj.authors)){
                    obj.authors.forEach(function (author) {
                        text += (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + " and ";
                    });
                }
                text = text.substring(0, text.length - 5) + "\",\n   title = \"" + obj.title.en + "\",\n   journal = \"" + obj.journal.title;
            } else {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + " and ";
                    });
                }
                text = text.substring(0, text.length - 5) + "\",\n   title = \"" + obj.title.cn + "\",\n   journal = \"" + obj.journal.titleCn;
            }
            text += "\",\n   year = \"" + obj.year + "\",\n   volume = \"" + obj.volume + "\",\n   number = \"" + obj.issue + "\",\n   eid = " + (obj.elocationId || "") + ",\n   pages = \"" + (obj.startPage || "") + "-" + (obj.endPage || "") + "\",\n   url = \"" + Config.rootUrl + name1 + "\",\n   doi = \"https://doi.org/" + obj.doi + "\" \n}\n\n";

            var filename = this.params.articleDoi + '.bib';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    });
    this.route('Endnote', {
        where: 'server',
        path: '/citation/endnote/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(!obj){
                this.response.writeHead(302, {'Location': "/"});
                return this.response.end();
            }
            var publisher = Publishers.findOne({_id: obj.publisher});
            var name1 = "publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "%0 Journal Article\n";
            if (obj.language == 1) {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += "%A " + (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + "\n";
                    });
                }
                text += "%T " + (obj.title.en || obj.title.cn) + "\n%D " + obj.year + "\n%J " + (obj.journal.title || obj.journal.titleCn);
            } else {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += "%A " + (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + "\n";
                    });
                }
                text += "%T " + (obj.title.cn || obj.title.en) + "\n%D " + obj.year + "\n%J " + (obj.journal.titleCn || obj.journal.title);
            }
            text += "\n%V " + obj.volume + "\n%N " + obj.issue + "\n%P " + (obj.elocationId || "") + "\n%R doi:https://doi.org/" + obj.doi + "\n";
            if (obj.keywords && obj.keywords.cn) {
                obj.keywords.cn.forEach(function (keyword) {
                    text += "%K " + keyword + "\n";
                });
            }
            text += "%U " + Config.rootUrl + name1 + "\n";

            var filename = this.params.articleDoi + '.enw';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    });
    this.route('RefWorks', {
        where: 'server',
        path: '/citation/refworks/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(!obj){
                this.response.writeHead(302, {'Location': "/"});
                return this.response.end();
            }
            var publisher = Publishers.findOne({_id: obj.publisher});
            var name1 = "publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "RT Journal Article\nSR Electronic(1)\n";
            if (obj.language == 1) {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += "A1 " + (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + "\n";
                    });
                }
                text += "YR " + obj.year + "\nT1 " + (obj.title.en || obj.title.cn) + "\nJF " + (obj.journal.title || obj.journal.titleCn);
            } else {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += "A1 " + (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + "\n";
                    });
                }
                text += "YR " + obj.year + "\nT1 " + (obj.title.cn || obj.title.en) + "\nJF " + (obj.journal.titleCn || obj.journal.title);
            }
            text += "\nVO " + obj.volume + "\nIS " + obj.issue + "\nSP " + (obj.elocationId || "") + "\nOP " + (obj.startPage ? obj.startPage + "-" + obj.endPage : "") + "\nDO https://doi.org/" + obj.doi + "\nUL " + Config.rootUrl + name1 + "\n\n";

            var filename = this.params.articleDoi + '.ref';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    });
    this.route('PubMed', {
        where: 'server',
        path: '/citation/pubmed/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi.replace(/-slash-/g,"/")});
            if(!obj){
                this.response.writeHead(302, {'Location': "/"});
                return this.response.end();
            }
            var publisher = Publishers.findOne({_id: obj.publisher});
            var text = "%0 Journal Article\n%D " + obj.year + "\n%@ " + obj.journal.issn.substring(0, 4) + "-" + obj.journal.issn.substring(3);
            if (obj.language == 1) {
                text += "\n%J " + (obj.journal.title || journal.titleCn) + "\n%V ";
            } else {
                text += "\n%J " + (obj.journal.titleCn || journal.title) + "\n%V ";
            }
            text += obj.volume + "\n%N " + obj.issue + "\n%R " + obj.doi + "\n%T ";
            if (obj.language == 1) {
                text += (obj.title.en || obj.title.cn) + "\n%U https://doi.org/" + obj.doi + "\n%I " + publisher.name;
            } else {
                text += (obj.title.cn || obj.title.en) + "\n%U https://doi.org/" + obj.doi + "\n%I " + publisher.chinesename;
            }
            text += "\n%8 " + (obj.published ? obj.published.format("yyyy-MM-dd") : "") + "\n";
            if (obj.keywords && obj.keywords.cn) {
                obj.keywords.cn.forEach(function (keyword) {
                    text += "%K " + keyword + "\n";
                });
            }
            if (obj.language == 1) {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += "%A " + (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + "\n";
                    });
                }
            } else {
                if(!_.isEmpty(obj.authors)) {
                    obj.authors.forEach(function (author) {
                        text += "%A " + (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + "\n";
                    });
                }
            }
            text += "%P " + (obj.startPage ? obj.startPage + "-" + obj.endPage : "") + "\n%G ";
            if (obj.language == 1) {
                text += "English\n";
            } else {
                text += "Chinese\n";
            }
            var filename = this.params.articleDoi + '.txt';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    });
    this.route('downloadPdf', {
        where: 'server',
        path: '/downloadPdf/:articleId',
        action: function () {
            var response = this.response;
            var request = this.request;
            var outputFileName = Guid.create() + ".pdf"
            var outputPath = Config.staticFiles.uploadPdfDir + "/handle/" + outputFileName;
            //logger.info(outputPath)
            //get this article by pdf id
            var article = Articles.findOne({_id: this.params.articleId}, {
                fields: {
                    doi: 1,
                    articledoi: 1,
                    title: 1,
                    journal: 1,
                    journalId:1,
                    publisher: 1,
                    authors: 1,
                    volume: 1,
                    issue: 1,
                    elocationId: 1,
                    firstPage: 1,
                    year: 1,
                    topic: 1,
                    pdfId: 1,
                    pubStatus: 1
                }
            });
            if (!article || !ScienceXML.FileExists(article.pdfId)) {
                if (article) {
                    logger.warn("pdf not found for this article: " + article.doi + " with this pdfId: " + article.pdfId);
                } else {
                    var ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress;
                    logger.warn("article not found at this id: " + this.params.articleId + " request came from "+ ip);
                }

                this.response.writeHead(302, {
                    'Location': "/"
                });

                this.response.end();
                return;
            }
            //create path to expected first page of pdf
            var adPdf = Config.staticFiles.uploadPdfDir + "/handle/" + this.params.articleId + (new Date()).getTime() + ".pdf";
            //准备需要添加到pdf中的数据
            //var lang = this.params.query.lang || "en";

            var journalInfo = Publications.findOne({_id: article.journalId});
            var publisherInfo = Publishers.findOne({_id: article.publisher});
            var langArr = ["en", "cn"];
            var getContentByLanguage = function (data, lang, specialArr) {
                if (_.isEmpty(data))return "";
                var index = lang === 'en' ? 0 : 1;
                if (specialArr) {
                    return data[specialArr[index]] || data[specialArr[1 - index]];
                }
                return data[langArr[index]] || data[langArr[1 - index]];
            };
            var lang = langArr[(journalInfo.language || 2) - 1];//使用文章所属刊的语言作为优先显示语言
            var data = {};
            //create path to journal banner and advert banner
            var host = Config.isDevMode ? Config.rootUrl : "http://localhost";
            if (journalInfo.banner && Images.findOne({_id: journalInfo.banner})) {
                data.banner = host + Images.findOne({_id: journalInfo.banner}).url({auth: false});
            }
            if (journalInfo.adBanner && Images.findOne({_id: journalInfo.adBanner})) {
                data.ad = host + Images.findOne({_id: journalInfo.adBanner}).url({auth: false});
                data.adhref=journalInfo.adhref;
            }

            //parse article metadata
            data.title = getContentByLanguage(article.title, lang);
            if (article.authors) {
                data.authors = _.map(article.authors, function (author) {
                    return {
                        name:getContentByLanguage(author.fullname, lang),
                        authorUrl:Config.rootUrl + 'search?fq={"author":["\\"'+ encodeURI(getContentByLanguage(author.fullname, lang)) + '\\""]}'
                    };
                });
            }
            data.journal = getContentByLanguage(journalInfo, lang, ["title", "titleCn"]);
            data.journalUrl = Config.rootUrl + "publisher/" + publisherInfo.shortname + "/journal/" + journalInfo.shortTitle
            data.volume = article.volume;
            data.issue = article.issue;
            data.page = article.elocationId || article.firstPage;
            data.year = article.year;
            data.doi = article.doi;
            data.fulltextUrl = Config.rootUrl + "doi/" + article.doi;
            data.tocUrl = Config.rootUrl + "publisher/" + publisherInfo.shortname + "/journal/" + journalInfo.shortTitle + "/" +article.volume + "/" + article.issue;
            data.publisher = getContentByLanguage(publisherInfo, lang, ["name", "chinesename"]);
            data.publisherUrl = Config.rootUrl + "publisher/" + publisherInfo.shortname;
            //create related article query
            var query = {q: "_text_:(" + data.title + ") AND NOT _id:" + article._id, wt: "json"};
            var topicArr = _.compact(article.topic);
            if (!_.isEmpty(topicArr)) {
                query.fq = {
                    all_topics: topicArr.join(" OR ")
                }
            }
            query.rows = 5;

            //get related articles
            SolrClient.query(query, function (err, result) {

                if (!err) {
                    var jsonResult = JSON.parse(result.content);
                    if (jsonResult.response && jsonResult.response.numFound) {
                        var similars = _.map(jsonResult.response.docs, function (atc) {
                            var atcObj = {};
                            atcObj.title = getContentByLanguage(atc, lang, ["title.en", "title.cn"]);
                            atcObj.journal = getContentByLanguage(atc, lang, ["journal.title", "journal.titleCn"]);
                            atcObj.volume = atc.volume;
                            atcObj.page = atc.elocationId || atc.firstPage;
                            atcObj.year = atc.year;
                            atcObj.doi = atc.doi;
                            atcObj.fulltextUrl = Config.rootUrl + "doi/" + atc.doi;
                            return atcObj;
                        })
                        data.similar = similars;
                    }
                }


                var html = JET.render('pdf', data);

                wkhtmltopdf('<html><head><meta charset="utf-8"/></head><body>' + html + '</body></html>',{output:adPdf}, Meteor.bindEnvironment(function (err, stream) {
                    if (err) {
                        console.dir(err);
                    }
                    var ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress;
                    var footmark = Config.pdf.footmark.replace("{ip}", ip || "unknown")
                        .replace("{time}", new Date().format("yyyy-MM-dd hh:mm:ss"))
                        .replace("{url}", Config.rootUrl + Science.URL.articleDetail(article._id).substring(1) || "");
                    var params = [
                        "-i", article.pdfId,   //待处理的pdf文件位置
                        "-o", outputPath, //处理完成后保存的文件位置
                        "-c", adPdf,       //广告页位置
                        "-f", footmark
                    ];
                    //预出版的文章pdf上需要加上“Accepted”字样的水印
                    if (article.pubStatus === 'accepted') {
                        params = _.union(params, ["-w", Config.pdf.watermark]);
                    }
                    Science.Pdf(params, function (error, stdout, stderr) {
                        Science.FSE.remove(adPdf);
                        if (stdout) {
                            // logger.debug(stdout);
                        }
                        if (stderr) {
                            console.log('------STDERR--------');
                            console.dir(stderr);
                            console.log('------STDERR--------');
                        }
                        if (!error) {
                            Science.FSE.exists(outputPath, function (result) {
                                if (result) {
                                    var stat = null;
                                    try {
                                        stat = Science.FSE.statSync(outputPath);
                                    } catch (_error) {
                                        logger.error(_error);
                                        response.statusCode = 404;
                                        response.end();
                                        return;
                                    }
                                    var headers = {
                                        'Content-Type': "application/pdf",
                                        'Content-Disposition': "attachment; filename=" + article.articledoi.replace(/\//g,"+") + ".pdf",
                                        'Content-Length': stat.size
                                    };

                                    response.writeHead(200, headers);

                                    var outstream = Science.FSE.createReadStream(outputPath);
                                    //将加了水印的pdf文件在下载结束后删除掉，避免过多占用存储空间
                                    outstream.on('close', function(){
                                        Science.FSE.remove(outputPath)
                                    });
                                    outstream.pipe(response);
                                }
                            });
                        } else {
                            throw error;
                        }
                    });
                }))

            });

        }
    });

});
