var urlToArticleByArticleObject = function (article) {
    if (!article)return;
    return getJournalComponentByArticle(article) + getIssueComponentByArticle(article) + "/" + article.doi;
}
var getJournalComponentByArticle = function (article) {
    if (!article)return;
    return getJournalComponentByJournalId(article.journalId);
}
var getJournalComponentByJournalId = function (id) {
    var journal = Publications.findOne({_id: id});
    if (!journal)return;
    var pub = Publishers.findOne({_id: journal.publisher});
    if (!pub)return;
    return "/publisher/" + pub.name + "/journal/" + journal.title;
}
var getIssueComponentByArticle = function (article) {
    if (!article)return;
    var issue = Issues.findOne({_id: article.issueId});
    return "/" + issue.volume + "/" + issue.issue;
}

var journalIdToName = function (id) {
    var journal = Publications.findOne({_id: id});
    return journal && (TAPi18n.getLanguage() === "zh-CN" ? journal.titleCn : journal.title);
}

Template.registerHelper('journalName', function (id) {
    return journalIdToName(id);
});

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

Template.registerHelper('urlToJournalById', function (id) {
    return getJournalComponentByJournalId(id);
});


Template.registerHelper('getImageHelper', function (pictureId) {
    var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
    var imgObj=Images && pictureId && Images.findOne({_id: pictureId});
    return (imgObj && imgObj.url()) || noPicture;
});

Template.registerHelper('isChinese', function (language) {
    if (!language) language = TAPi18n.getLanguage();
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
    return str.replace(/[^\w\d_-]/g, "-")
});

Template.registerHelper("highlight", function (keyword, str) {
    return str.split(keyword).join("<span class='highlight'>" + keyword + "</span>")
});

Template.registerHelper('checkPermissionToJournal', function (permissions, publisherId, journalId) {
    if (!Meteor.user()) return false;
    if (Permissions.isAdmin()) return true;
    
    if (Meteor.user().publisherId){
        if (Meteor.user().publisherId !== publisherId) return false;
        if (!_.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user")){
            //if (!journalId) return false;
            if (!_.contains(Meteor.user().journalId, journalId)) return false;
        }
    }
    permissions = permissions.split(';');
    //console.log(permissions);
    var flag = false;
    permissions.forEach(function (onePermission) {
        onePermission = onePermission.split(',');
        //console.log(onePermission);
        if (Permissions.userCan(onePermission[0], onePermission[1])) flag = true;
    });
    return flag;

});
