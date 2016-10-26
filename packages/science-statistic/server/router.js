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
        if (this.request.query.startDate && this.request.query.startDate !== 'null') {
            start = new Date(this.request.query.startDate.substring(0,4)+"-"+this.request.query.startDate.substring(4,6));
            query.dateCode = {$gte:Number(this.request.query.startDate)};
        }
        if (this.request.query.endDate && this.request.query.endDate !== 'null') {
            end = new Date(this.request.query.endDate.substring(0,4)+"-"+this.request.query.endDate.substring(4,6));
            if(query.dateCode){
                query.dateCode["$lte"]= Number(this.request.query.endDate);
            }else{
                query.dateCode = {$lte: Number(this.request.query.endDate)};
            }
        }
        var reportType = this.request.query.reportType;
        var file;
        var fileName = "statistic";
        if (reportType === "keyword") {
            fileName = "Keyword_Report";
            file = Science.Reports.getKeywordReportFile(query, fileName, start, end);
        } else if (reportType === "journalOverview") {
            fileName = "Journal_Home_Page_Click_Report";
            file = Science.Reports.getJournalOverviewReportFile(query, fileName, start, end);
        }else if (reportType === "journalBrowse") {
            fileName = "Journal__Browse_Report";
            file = Science.Reports.getJournalBrowseReportFile(query, fileName, start, end);
        }else if (reportType === "watchJournal") {
            fileName = "Journal_Watch_Report";
            file = Science.Reports.getJournalWatchReportFile(query, fileName, start, end);
        } else if (reportType === "fulltext") {
            fileName = "Article_Full_Text_Report";
            file = Science.Reports.getArticleFulltextReportFile(query, fileName, start, end);
        } else if (reportType === "abstract") {
            fileName = "Article_Abstract_Report";
            file = Science.Reports.getArticleAbstractReportFile(query, fileName, start, end);
        } else if (reportType === "pdfDownload") {
            fileName = "Article_PDFDownload_Report";
            file = Science.Reports.getPDFDownloadReportFile(query, fileName, start, end);
        } else if (reportType === "favourite") {
            fileName = "Article_Favourite_Report";
            file = Science.Reports.getArticleFavouriteReportFile(query, fileName, start, end);
        } else if (reportType === "watchArticle") {
            fileName = "Article_Watch_Report";
            file = Science.Reports.getArticleWatchReportFile(query, fileName, start, end);
        } else if (reportType === "emailThis") {
            fileName = "Article_Recommend_Report";
            file = Science.Reports.getArticleRecommendReportFile(query, fileName, start, end);
        } else if (reportType === "journalAbstract") {
            query.action = "abstract";
            fileName = "Journal_Article_Abstract_Report";
            file = Science.Reports.getJournalAbstractReportFile(query, fileName, start, end);
        }else if (reportType === "journalFulltext") {
            query.action = "fulltext";
            fileName = "Journal_Article_Fulltext_Report";
            file = Science.Reports.getJournalFulltextReportFile(query, fileName, start, end);
        }else if (reportType === "journalDownload") {
            query.action = "pdfDownload";
            fileName = "Journal_Article_DownLoad_Report";
            file = Science.Reports.getJournalDownloadReportFile(query, fileName, start, end);
        }else if (reportType === "journalFavourite") {
            query.action = "favourite";
            fileName = "Journal_Article_Favourite_Report";
            file = Science.Reports.getJournalArticleFavouriteReportFile(query, fileName, start, end);
        }else if (reportType === "journalWatchArticle") {
            query.action = "watchArticle";
            fileName = "Journal_Article_Watch_Report";
            file = Science.Reports.getJournalArticleWatchReportFile(query, fileName, start, end);
        }else if (reportType === "journalEmailThis") {
            query.action = "emailThis";
            fileName = "Journal_Article_Recommend_Report";
            file = Science.Reports.getJournalArticleRecommendReportFile(query, fileName, start, end);
        }else if (reportType === "journalArticleBrowse") {
            fileName = "Journal_Article_Browse_Download_Report";
            file = Science.Reports.getJournalArticleBrowseReportFile(query, fileName);
        }else if (reportType === "journalArticleFavourite") {
            fileName = "Journal_Article_Favourite_Watch_Recommend_Report";
            file = Science.Reports.getJournalArticleFavouriteWatchReportFile(query, fileName);
        }else if (reportType === "articleBrowse") {
            fileName = "Article_Browse_Download_Report";
            file = Science.Reports.getArticleBrowseReportFile(query, fileName);
        }else if (reportType === "articleFavourite") {
            fileName = "Article_Favourite_Watch_Recommend_Report";
            file = Science.Reports.getArticleFavouriteWatchReportFile(query, fileName);
        }else if (reportType === "userJournal") {
            fileName = "Users_Journal_Action_Report";
            file = Science.Reports.getUsersJournalReportFile(query, fileName);
        }else if (reportType === "userArticle") {
            fileName = "Users_Article_Action_Report";
            file = Science.Reports.getUsersArticleReportFile(query, fileName);
        }else if (reportType === "institutionJournal") {
            fileName = "Institution_Journal_Action_Report";
            file = Science.Reports.getInstitutionJournalReportFile(query, fileName);
        }else if (reportType === "institutionArticle") {
            fileName = "Institution_Article_Action_Report";
            file = Science.Reports.getInstitutionArticleReportFile(query, fileName);
        }else if (reportType === "regionalJournal") {
            fileName = "Journal_Regional_Report";
            file = Science.Reports.getRegionalJournalReportFile(query, fileName);
        }else if (reportType === "regionalArticle") {
            fileName = "Article_Regional_Report";
            file = Science.Reports.getRegionalArticleReportFile(query, fileName);
        }else if (reportType === "journalCited") {
            fileName = "Journal_Cited_Report";
            file = Science.Reports.getCitedJournalReportFile(query, fileName);
        }else if (reportType === "articleCited") {
            fileName = "Article_Cited_Report";
            file = Science.Reports.getCitedArticleReportFile(query, fileName, start, end);
        }else return;
        var headers = {
            'Content-type': 'application/vnd.openxmlformats;charset=utf-8',
            'Content-Disposition': 'attachment; filename=' + new Date().toISOString().slice(0, 10) + "_" + fileName + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    }
});

