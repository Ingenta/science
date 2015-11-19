Science.Email = {};

Science.Email.searchFrequencyEmail = function () {
    var topicNames = [];
    Topics.find({}, {fields: {name: 1, englishName: 1}}).forEach(function (ondTopic) {
        if(ondTopic.name) topicNames.push(ondTopic.name);
        if(ondTopic.englishName) topicNames.push(ondTopic.englishName);
    });
    var searchLogs = SearchLog.find({
        str: {$nin: topicNames},
        count: {$gte: Config.searchKeywordFrequency}
    }).fetch();
    if (searchLogs.length) {
        var emailConfig = EmailConfig.findOne({key: "keywordFrequency"});
        Email.send({
            to: Users.findOne({username: Config.sysAdmin}).emails[0].address,
            from: 'publish@scichina.org',
            subject: emailConfig ? emailConfig.subject : 'Search Keyword Frequency Reached',
            html: JET.render('searchFrequency', {
                "searchLogs": searchLogs,
                "scpLogoUrl": Config.rootUrl + "email/logo.png",
                "emailIcoUrl": Config.rootUrl + "email/ico.png",
                "rootUrl": Config.rootUrl
            })

        });
        console.log("email sent");
        searchLogs.forEach(function (entry) {
            SearchLog.update({_id: entry._id}, {$set: {count: 0}});
        });
    }
};

Science.Email.watchJournalEmail = function (oneEmail) {
    Email.send({
        to: oneEmail.email,
        from: 'publish@scichina.org',
        subject: "《" + oneEmail.journal.titleCn + "》更新第" + oneEmail.issue.issue + "期",
        html: JET.render('watchJournal', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "emailIcoUrl": Config.rootUrl + "email/ico.png",
            "rootUrl": Config.rootUrl,
            "issue": oneEmail.issue,
            "journal": oneEmail.journal,
            "articleList": oneEmail.articleList,
            "journalNews": oneEmail.journalNews
        })
    });
};

Science.Email.watchTopicEmail = function (oneEmail) {
    Email.send({
        to: oneEmail.email,
        from: 'publish@scichina.org',
        subject: oneEmail.topic.name + "下有文章更新",
        html: JET.render('watchTopic', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "emailIcoUrl": Config.rootUrl + "email/ico.png",
            "rootUrl": Config.rootUrl,
            "topic": oneEmail.topic,
            "articleList": oneEmail.articleList,
            "homePageNews": oneEmail.homePageNews
        })
    });
};

Science.Email.test = function (template, theData){
    Email.send({
        to: "dongdong.yang@digitalpublishing.cn",
        from: 'publish@scichina.org',
        subject: 'test',
        html: JET.render(template, theData)
    });
    console.log('waitting for email');
};
