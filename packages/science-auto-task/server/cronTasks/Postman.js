SyncedCron.add({
    name: "Postman",
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.Postman.rate || "at 4:00 am");
    },
    job: function () {
        logger.silly('Postman starts.');

        var today = moment().startOf('day');
        var yesterday = moment(today).subtract(1, 'days').toDate();
        var lastWeek = moment(today).subtract(7, 'days').toDate();
        //var lastMonth = moment(today).subtract(1, 'months').toDate();
        today = today.toDate();

        if(EmailConfig.findOne({key: "availableOnline"}).frequency == 'on') {
            if(!EmailConfig.findOne({key: "availableOnline"}).lastSentDate || EmailConfig.findOne({key: "availableOnline"}).lastSentDate.getTime() <= lastWeek.getTime()){
                logger.info("ready to send availableOnline email");
                Science.Email.availableOnline(lastWeek);
                EmailConfig.update({key: "availableOnline"}, {$set:{lastSentDate: today}});
            }
        }

        if(EmailConfig.findOne({key: "watchTopic"}).frequency == 'on') {
            if(!EmailConfig.findOne({key: "watchTopic"}).lastSentDate || EmailConfig.findOne({key: "watchTopic"}).lastSentDate.getTime() <= lastWeek.getTime()){
                logger.info("ready to send watchTopic email");
                Science.Email.watchTopicEmail(lastWeek);
                EmailConfig.update({key: "watchTopic"}, {$set:{lastSentDate: today}});
            }
        }

        if(EmailConfig.findOne({key: "keywordFrequency"}).frequency == 'on') {
            logger.info("ready to send keywordFrequency email");
            Science.Email.searchFrequencyEmail();
        }

        if(EmailConfig.findOne({key: "watchJournal"}).frequency == 'on') {
            logger.info("ready to send watchJournal email");
            Science.Email.tableOfContentEmail(yesterday);
        }

        if(EmailConfig.findOne({key: "articleCitedAlert"}).frequency == 'on') {
            logger.info("ready to send articleCitedAlert email");
            Science.Email.authorCitationAlertEmail(today);
        }

        if(EmailConfig.findOne({key: "watchArticle"}).frequency == 'on') {
            logger.info("ready to send watchArticle email");
            Science.Email.watchArticleCitedAlertEmail(today);
        }
        logger.silly('Postman ends.');
    }
});