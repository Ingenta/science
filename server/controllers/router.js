Router.map(function () {
    this.route('PlainText', {
        where: 'server',
        path: '/citation/plaintext/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var text = undefined;
            if (obj.language == 1) {
                text = obj.title.en || obj.title.cn;
                obj.authors.forEach(function (author) {
                    text += (author.given.en || author.given.cn) + ", " + (author.surname.en || author.surname.cn) + " and ";
                });
                text = text.substring(0, text.length - 5);
                text += ", " + (obj.journal.title || obj.journal.titleCn) + ", ";
            } else {
                text = obj.title.cn || obj.title.en;
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
            var name1 = "/publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
            var text = "@article{:" + name1 + ",\n   author = \"";
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
            text += "\",\n   year = \"" + obj.year + "\",\n   volume = \"" + obj.volume + "\",\n   number = \"" + obj.issue + "\",\n   eid = " + (obj.elocationId || "") + ",\n   pages = \"" + (obj.startPage || "") + "-" + (obj.endPage || "") + "\",\n   url = \"" + Config.host.url + name1 + "\",\n   doi = \"http://dx.doi.org/" + obj.doi + "\" }";

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
            var name1 = "/publisher/" + publisher.name + "/journal/" + obj.journal.title + "/" + obj.volume + "/" + obj.issue + "/" + obj.doi;
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
            text += "\n%V " + obj.volume + "\n%N " + obj.issue + "\n%P " + obj.elocationId + "\n%R doi:http://dx.doi.org/" + obj.doi + "\n";

            obj.keywords.forEach(function (keyword) {
                text += "%K " + keyword + "\n";
            });
            text +="%U " + Config.host.url + name1 + "\n";

            var filename = this.params.articleDoi + '.enw';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    });
});