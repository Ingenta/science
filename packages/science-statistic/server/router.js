Router.route('downloadExcel', {
    where: 'server',
    path: '/download-data',
    action: function () {
        var query = {};
        if (!this.request.query.reportType) return;
        else {
            query.action = this.request.query.reportType;
        }
        if (this.request.query.publisher && this.request.query.publisher!=='null') {
            query.publisher = this.request.query.publisher;
        }
        if (this.request.query.publications && this.request.query.publications!=='null') {
            query.journalId = this.request.query.publications;
        }
        if (this.request.query.institution && this.request.query.institution!=='null') {
            query.institutionId = this.request.query.institution;
        }
        //if (this.request.query.startDate && this.request.query.startDate!=='null') {
        //    var date1 = this.request.query.startDate.subscribe();
        //    var date2 = this.request.query.startDate;
        //    var startCode = startDate.getUTCFullYear() * 100 + (startDate.getUTCMonth() + 1);
        //    console.dir(startDate);
        //}
        //if (this.request.query.endDate && this.request.query.endDate!=='null') {
        //    var endDate = this.request.query.endDate;
        //    var endCode = endDate.getUTCFullYear() * 100 + (endDate.getUTCMonth() + 1);
        //    console.dir(endDate);
        //}

        var reportType = this.request.query.reportType;
        var file;
        var fileName = "statistic";
        if (reportType === "keyword") {
            fileName = "Keyword_Report";
            file = Science.Reports.getKeywordReportFile(query, fileName);
        } else if (reportType === "journalBrowse") {
            fileName = "Journal_Report";
            file = Science.Reports.getJournalReportFile(query, fileName);
        } else return;
        var headers = {
            'Content-type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + fileName + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    }
});

