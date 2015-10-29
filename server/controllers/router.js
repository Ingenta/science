Meteor.startup(function(){
    if(Meteor.isServer){
        //确保pdf处理中间过程需要的文件夹存在
        Science.FSE.ensureDir(Config.uploadPdfDir + "/handle/",function(err){
            if(err)
                throw new Meteor.Error(err);
        });
    }
})
Router.map(function () {
    this.route('PlainText', {
        where: 'server',
        path: '/citation/plaintext/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var text = undefined;
            if (obj.language == 1) {
                text = (obj.title.en || obj.title.cn) + "\n";
                obj.authors.forEach(function (author) {
                    text += (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + " and ";
                });
                text = text.substring(0, text.length - 5);
                text += ", " + (obj.journal.title || obj.journal.titleCn) + ", ";
            } else {
                text = (obj.title.cn || obj.title.en) + "\n";
                obj.authors.forEach(function (author) {
                    text += (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + " and ";
                });
                text = text.substring(0, text.length - 5);
                text += ", " + (obj.journal.titleCn || obj.journal.title) + ", ";
            }
            text += obj.volume + ", " + obj.elocationId + " (" + obj.year + "), DOI:http://dx.doi.org/" + obj.doi;

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
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var publisher = Publishers.findOne({_id: obj.publisher});
            var name1 = "publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "@article{:/" + name1 + ",\n   author = \"";
            if (obj.language == 1) {
                obj.authors.forEach(function (author) {
                    text += (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + " and ";
                });
                text = text.substring(0, text.length - 5) + "\",\n   title = \"" + obj.title.en + "\",\n   journal = \"" + obj.journal.title;
            } else {
                obj.authors.forEach(function (author) {
                    text += (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + " and ";
                });
                text = text.substring(0, text.length - 5) + "\",\n   title = \"" + obj.title.cn + "\",\n   journal = \"" + obj.journal.titleCn;
            }
            text += "\",\n   year = \"" + obj.year + "\",\n   volume = \"" + obj.volume + "\",\n   number = \"" + obj.issue + "\",\n   eid = " + (obj.elocationId || "") + ",\n   pages = \"" + (obj.startPage || "") + "-" + (obj.endPage || "") + "\",\n   url = \"" + Meteor.absoluteUrl() + name1 + "\",\n   doi = \"http://dx.doi.org/" + obj.doi + "\" \n}\n\n";

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
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var publisher = Publishers.findOne({_id: obj.publisher});
            var name1 = "publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "%0 Journal Article\n";
            if (obj.language == 1) {
                obj.authors.forEach(function (author) {
                    text += "%A " + (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + "\n";
                });
                text += "%T " + (obj.title.en || obj.title.cn) + "\n%D " + obj.year + "\n%J " + (obj.journal.title || obj.journal.titleCn);
            } else {
                obj.authors.forEach(function (author) {
                    text += "%A " + (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + "\n";
                });
                text += "%T " + (obj.title.cn || obj.title.en) + "\n%D " + obj.year + "\n%J " + (obj.journal.titleCn || obj.journal.title);
            }
            text += "\n%V " + obj.volume + "\n%N " + obj.issue + "\n%P " + (obj.elocationId || "") + "\n%R doi:http://dx.doi.org/" + obj.doi + "\n";

            obj.keywords.forEach(function (keyword) {
                text += "%K " + keyword + "\n";
            });
            text += "%U " + Meteor.absoluteUrl() + name1 + "\n";

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
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var publisher = Publishers.findOne({_id: obj.publisher});
            var name1 = "publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "RT Journal Article\nSR Electronic(1)\n";
            if (obj.language == 1) {
                obj.authors.forEach(function (author) {
                    text += "A1 " + (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + "\n";
                });
                text += "YR " + obj.year + "\nT1 " + (obj.title.en || obj.title.cn) + "\nJF " + (obj.journal.title || obj.journal.titleCn);
            } else {
                obj.authors.forEach(function (author) {
                    text += "A1 " + (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + "\n";
                });
                text += "YR " + obj.year + "\nT1 " + (obj.title.cn || obj.title.en) + "\nJF " + (obj.journal.titleCn || obj.journal.title);
            }
            text += "\nVO " + obj.volume + "\nIS " + obj.issue + "\nSP " + (obj.elocationId || "") + "\nOP " + (obj.startPage ? obj.startPage + "-" + obj.endPage : "") + "\nDO http://dx.doi.org/" + obj.doi + "\nUL " + Meteor.absoluteUrl() + name1 + "\n\n";

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
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var publisher = Publishers.findOne({_id: obj.publisher});
            var text = "%0 Journal Article\n%D " + obj.year + "\n%@ " + obj.journal.issn.substring(0, 4) + "-" + obj.journal.issn.substring(3);
            if (obj.language == 1) {
                text += "\n%J " + (obj.journal.title || journal.titleCn) + "\n%V ";
            } else {
                text += "\n%J " + (obj.journal.titleCn || journal.title) + "\n%V ";
            }
            text += obj.volume + "\n%N " + obj.issue + "\n%R " + obj.doi + "\n%T ";
            if (obj.language == 1) {
                text += (obj.title.en || obj.title.cn) + "\n%U http://dx.doi.org/" + obj.doi + "\n%I " + publisher.name;
            } else {
                text += (obj.title.cn || obj.title.en) + "\n%U http://dx.doi.org/" + obj.doi + "\n%I " + publisher.chinesename;
            }
            text += "\n%8 " + (obj.published ? obj.published.format("yyyy-MM-dd") : "") + "\n";
            obj.keywords.forEach(function (keyword) {
                text += "%K " + keyword + "\n";
            });
            if (obj.language == 1) {
                obj.authors.forEach(function (author) {
                    text += "%A " + (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + "\n";
                });
            } else {
                obj.authors.forEach(function (author) {
                    text += "%A " + (author.given.cn || author.given.en) + ", " + (author.surname.cn || author.surname.en) + "\n";
                });
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
    this.route('downloadPdf',{
        where: 'server',
        path: '/downloadPdf/:pdfId',
        action:function(){
            var pdf=Collections.Pdfs.findOne({_id:this.params.pdfId});
            if(pdf){
                var article=Articles.findOne({pdfId:this.params.pdfId},{fields:{doi:1,pubStatus:1}});
                var adPdf = Config.uploadPdfDir + "/handle/"+ (new Date()).getTime() + ".pdf";
                var html = JET.render('pdf');
                var response = this.response;
                var request = this.request;
                wkhtmltopdf('<html><head><meta charset="utf-8"/></head><body>'+html+'</body></html>', Meteor.bindEnvironment(function(code, signal) {

                    var ip= request.headers["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress;
                    var footmark = Config.pdf.footmark.replace("{ip}",ip || "unknown")
                        .replace("{time}",new Date().format("yyyy-MM-dd hh:mm:ss"))
                        .replace("{url}",Config.rootUrl + Science.URL.articleDetail(article._id) || "");
                    var params = [
                        "-i",Config.uploadPdfDir + "/" + pdf.copies.pdfs.key,   //待处理的pdf文件位置
                        "-o",Config.uploadPdfDir + "/handle/"+pdf.copies.pdfs.key, //处理完成后保存的文件位置
                        "-s",adPdf,       //广告页位置
                        "-f",footmark
                    ];
                    //预出版的文章pdf上需要加上“Accepted”字样的水印
                    if(article.pubStatus === 'preset'){
                        params=_.union(params,["-w",Config.pdf.watermark]);
                    }
                    Science.Pdf(params,function(error,stdout,stderr){
                        //Science.FSE.remove(adPdf);
                            if(stdout){
                                console.log('------STDOUT--------');
                                console.dir(stdout);
                                console.log('------STDOUT--------');
                            }
                            if(stderr){
                                console.log('------STDERR--------');
                                console.dir(stderr);
                                console.log('------STDERR--------');
                            }
                            if(!error){
                                Science.FSE.exists(Config.uploadPdfDir + "/handle/"+pdf.copies.pdfs.key,function(result){
                                    if(result){
                                        var headers = {
                                            'Content-Type': pdf.copies.pdfs.type,
                                            'Content-Disposition': "attachment; filename=" + pdf.copies.pdfs.name
                                        };

                                        response.writeHead(200, headers);
                                        response.end(Science.FSE.readFileSync(Config.uploadPdfDir + "/handle/"+pdf.copies.pdfs.key));
                                    }
                                });
                            }else{
                                throw error;
                            }
                        }
                    );
                })).pipe(Science.FSE.createWriteStream(adPdf));
            }
        }
    })
});