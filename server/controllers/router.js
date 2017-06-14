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
