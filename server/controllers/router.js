Router.map(function () {
    this.route('txtFile', {
        where: 'server',
        path: '/citation/plaintext/:publisherDoi/:articleDoi',
        action: function () {
            var obj = Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            var text = undefined;
            if (obj.language == 1) {
                text = obj.title.en;
                obj.authors.forEach(function (author) {
                    text += author.given.en + ", " + author.surname.en + ", ";
                });
                text += obj.journal.title + ", ";
            } else {
                text = obj.title.cn;
                obj.authors.forEach(function (author) {
                    text += author.given.cn + ", " + author.surname.cn + ", ";
                });
                text += obj.journal.titleCn + ", ";
            }
            text += obj.volume + ", " + obj.elocationId + " (" + obj.year + "), DOI:http://dx.doi.org/" + this.params.publisherDoi + "/" + this.params.articleDoi;

            var filename = this.params.articleDoi + '.txt';
            var headers = {
                'Content-Type': 'text/plain',
                'Content-Disposition': "attachment; filename=" + filename
            };

            this.response.writeHead(200, headers);
            return this.response.end(text);
        }
    })
});