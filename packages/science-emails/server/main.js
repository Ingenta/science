Science.Email = {};

Science.Email.searchFrequencyEmail = function () {
    var searchLogs = SearchLog.find({count: {$gte: Config.searchKeywordFrequency}}).fetch();
    if (searchLogs.length) {
        var emailConfig = EmailConfig.findOne({key: "keywordFrequency"});
        Email.send({
            to: Users.findOne({username: Config.sysAdmin}).emails[0].address,
            from: 'publish@scichina.org',
            subject: emailConfig ? emailConfig.subject : 'Search Keyword Frequency Reached',
            html: JET.render('searchFrequency', {"searchLogs":searchLogs})

        });
        searchLogs.forEach(function (entry) {
            SearchLog.update({_id: entry._id}, {$set: {count: 0}});
        });
    }
};