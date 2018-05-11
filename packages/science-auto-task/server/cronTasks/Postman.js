if(process.env.RUN_TASKS){
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

            //期刊上新期时,给关注此刊的所有用户发送更新目录
            logger.info("ready to send watchJournal email");
            Science.Email.tableOfContentEmail(yesterday);

            //期刊上预出版文章时,给关注此刊的所有用户发送预出版更新目录
            if(!EmailConfig.findOne({key: "availableOnline"}).lastSentDate || EmailConfig.findOne({key: "availableOnline"}).lastSentDate.getTime() <= lastWeek.getTime()){
                logger.info("ready to send availableOnline email");
                Science.Email.availableOnline(lastWeek);
                EmailConfig.update({key: "availableOnline"}, {$set:{lastSentDate: today}});
            }

            //主题下有新文章时,给关注此主题的所有用户发送更新提醒
            if(!EmailConfig.findOne({key: "watchTopic"}).lastSentDate || EmailConfig.findOne({key: "watchTopic"}).lastSentDate.getTime() <= lastWeek.getTime()){
                logger.info("ready to send watchTopic email");
                Science.Email.watchTopicEmail(lastWeek);
                EmailConfig.update({key: "watchTopic"}, {$set:{lastSentDate: today}});
            }

            //文章的被引用信息变化时给文章通讯作者发送提醒邮件
            logger.info("ready to send articleCitedAlert email");
            Science.Email.authorCitationAlertEmail(today);

            //文章的被引用信息变化时给关注了该文章的用户发送提醒邮件
            logger.info("ready to send watchArticle email");
            Science.Email.watchArticleCitedAlertEmail(today);

            //关键词被搜索次数达到一定数量时,给管理员发送提醒邮件
            logger.info("ready to send keywordFrequency email");
            Science.Email.searchFrequencyEmail();


            logger.silly('Postman ends.');
        }
    });
}