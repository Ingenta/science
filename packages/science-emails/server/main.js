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
            html: JET.render('searchFrequency', {"searchLogs": searchLogs, "scpbannerurl": Meteor.absoluteUrl()+ "email/logo.png", "rootUrl": Config.rootUrl})

        });
        console.log("email sent");
        searchLogs.forEach(function (entry) {
            SearchLog.update({_id: entry._id}, {$set: {count: 0}});
        });
    }
};