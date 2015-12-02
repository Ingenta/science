Router.route('downloadExcel', {
    where: 'server',
    path: '/download-data',
    action: function () {
        var query = {};
        var start, end;
        if (!this.request.query.reportType) return;
        else {
            query.action = this.request.query.reportType;
        }
        if (this.request.query.publisher && this.request.query.publisher !== 'null') {
            query.publisher = {$in: this.request.query.publisher.split(',')};
        }
        if (this.request.query.publications && this.request.query.publications !== 'null') {
            query.journalId = {$in: this.request.query.publications.split(',')};
        }
        if (this.request.query.institution && this.request.query.institution !== 'null') {
            query.institutionId = {$in: this.request.query.institution.split(',')};
        }
        if (this.request.query.startDate && this.request.query.startDate !== 'null' && this.request.query.endDate && this.request.query.endDate !== 'null') {
            query.when = {$gte: new Date(this.request.query.startDate), $lte: new Date(this.request.query.endDate)};
        }
        if (this.request.query.startDate && this.request.query.startDate !== 'null') {
            start = new Date(this.request.query.startDate);
            query.when = {$gte: new Date(this.request.query.startDate)};
        }

        if (this.request.query.endDate && this.request.query.endDate !== 'null') {
            end = new Date(this.request.query.endDate);
            query.when = {$lte: new Date(this.request.query.endDate)};
        }
        var reportType = this.request.query.reportType;
        var file;
        var fileName = "statistic";
        if (reportType === "keyword") {
            fileName = "Keyword_Report";
            file = Science.Reports.getKeywordReportFile(query, fileName, start, end);
        } else if (reportType === "journalBrowse") {
            fileName = "Journal_Home_Page_Report";
            file = Science.Reports.getJournalReportFile(query, fileName, start, end);
        } else return;
        var headers = {
            'Content-type': 'application/vnd.openxmlformats;charset=utf-8',
            'Content-Disposition': 'attachment; filename=' + new Date().toISOString().slice(0, 10) + "_" + fileName + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    }
});

