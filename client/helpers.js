var urlToArticleByArticleObject = function (article) {
    if (!article)return;
    return getJournalComponentByArticle(article) + getIssueComponentByArticle(article) + "/" + article.doi;
}
var getJournalComponentByArticle = function (article) {
    if (!article)return;
    var pub = Publishers.findOne({_id: article.publisher});
    if (!pub)return;
    var journal = Publications.findOne({_id: article.journalId});
    if (!journal)return;
    return "/publisher/" + pub.name + "/journal/" + journal.title;
}
var getIssueComponentByArticle = function (article) {
    if (!article)return;
    var issue = Issues.findOne({_id: article.issueId});
    return "/" + issue.volume + "/" + issue.issue;
}

Template.registerHelper('urlToArticle', function (title) {
    var article = Articles.findOne({'title.en': title});
    return urlToArticleByArticleObject(article);
});

Template.registerHelper('urlToArticleById', function (id) {
    var article = Articles.findOne({_id: id});
    return urlToArticleByArticleObject(article);
});

Template.registerHelper('urlToJournal', function (title) {
    var article = Articles.findOne({'title.en': title});
    return getJournalComponentByArticle(article);
});


Template.registerHelper('getImageHelper', function (pictureId) {
    var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
    return (Images && pictureId && Images.findOne({_id: pictureId}).url()) || noPicture;
});

Template.registerHelper('isChinese', function (language) {
    if(!language) language = TAPi18n.getLanguage();
    return language === "zh-CN" ? true : false;
});

Template.registerHelper('translateThis', function (chinese, english) {
    if (TAPi18n.getLanguage() === "zh-CN") {
        if (!chinese)return english;
        return chinese;
    }
    if (!english)return chinese;
    return english;
});

Template.registerHelper('getCreateButtonContent', function () {
    return TAPi18n.__("Create");
});

Template.registerHelper('getUpdateButtonContent', function () {
    return TAPi18n.__("Update");
});

Template.registerHelper('getDeleteButtonContent', function () {
    return TAPi18n.__("Delete");
});

pluralize = function (n, thing, options) {
    var plural = thing;
    if (_.isUndefined(n)) {
        return thing;
    } else if (n !== 1) {
        if (thing.slice(-1) === 's')
            plural = thing + 'es';
        else
            plural = thing + 's';
    }

    if (options && options.hash && options.hash.wordOnly)
        return plural;
    else
        return n + ' ' + plural;
}

Template.registerHelper('pluralize', pluralize);


Template.registerHelper('clearStr', function (str) {
    str = str.replace(/(<\/?[^>]+?>|\.)/g, '');
    return str.replace(/\s/g, '-');
});

Template.registerHelper("highlight", function (keyword, str) {
    return str.split(keyword).join("<span class='highlight'>" + keyword + "</span>")
});

Template.registerHelper('checkPermissionToJournal', function (roles, publisherId, journalId) {
    if(!Meteor.user()) return false;
    if(_.contains(Permissions.getUserRoles(), "permissions:admin")) return true;
    if(!Meteor.user().publisherId) return false;
    if(Meteor.user().publisherId !== publisherId) return false;
    if(_.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user")) return true;
    if(!journalId) return false;
    if(!_.contain(Meteor.user().journalId, journalId)) return false;
    roles = roles.split(',');
    console.log(roles);
    roles.forEach(function (oneRole) {
        if(_.contains(Permissions.getUserRoles(), oneRole)) return true;
    });
    return false;

});