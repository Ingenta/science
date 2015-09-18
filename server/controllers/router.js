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
                text += "中文\n";
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
});