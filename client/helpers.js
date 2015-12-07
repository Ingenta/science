urlToArticleByArticleById = function (articleId) {
    if (!articleId)return;
    return urlToArticleByArticleObject(Articles.findOne({_id: articleId}));
}

var urlToArticleByArticleObject = function (article) {
    if (!article)return;
    return getJournalComponentByArticle(article) + getIssueComponentByArticle(article) + "/" + article.doi;
}
var getJournalComponentByArticle = function (article) {
    if (!article)return;
    return getJournalComponentByJournalId(article.journalId);
}
getJournalComponentByJournalId = function (id) {
    var journal = Publications.findOne({_id: id}, {fields: {shortTitle: 1, publisher: 1}});
    if (!journal)return;
    var pub = Publishers.findOne({_id: journal.publisher}, {fields: {shortname: 1}});
    if (!pub)return;
    return "/publisher/" + pub.shortname + "/journal/" + journal.shortTitle;
}
var getIssueComponentByArticle = function (article) {
    if (!article)return;
    //commented out to avoid subscribing to all issues, because currently issue name are not editable this will not affect anything
    //var issue = Issues.findOne({_id: article.issueId});
    //if(!issue)return;
    return "/" + article.volume + "/" + article.issue;
}

journalIdToName = function (id) {
    var journal = Publications.findOne({_id: id}, {fields: {titleCn: 1, title: 1}});
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
    return urlToArticleByArticleById(id);
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
    var imgObj = Images && pictureId && Images.findOne({_id: pictureId});
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

Template.registerHelper('permissionCheckWithScope', function (permission, package_name, scope_key, scope_value) {
//    if (!Meteor.user()) return false;
//    if (Permissions.isAdmin()) return true;
//
//    if (Meteor.user().publisherId) {
//        if (Meteor.user().publisherId !== publisherId) return false;
//        if (!_.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user")) {
//            //if (!journalId) return false;
//            if (!_.contains(Meteor.user().journalId, journalId)) return false;
//        }
//    }
//    permissions = permissions.split(';');
//    var flag = false;
//    permissions.forEach(function (onePermission) {
//        onePermission = onePermission.split(',');
//        if (Permissions.userCan(onePermission[0], onePermission[1])) flag = true;
//    });
//    return flag;
    var scope = {};
    scope[scope_key] = scope_value;
    return Permissions.userCan(permission, package_name, Meteor.userId(), scope);
});

Template.registerHelper('collectionPermissionCheck', function (permissions, publisherId, journalId) {
    permissions = permissions.split(',');
    if (!publisherId) {
        return Permissions.userCan("add-publisher-collection", 'collections');
    } else if (journalId) {
        var onePermission = _.intersection(permissions, ["add-journal-collection", "modify-journal-collection", "delete-journal-collection"])[0];
        return Permissions.userCan(onePermission, 'collections', Meteor.userId(), {journal: journalId});
    } else {
        var onePermission = _.intersection(permissions, ["add-publisher-collection", "modify-publisher-collection", "delete-publisher-collection"])[0];
        return Permissions.userCan(onePermission, 'collections', Meteor.userId(), {publisher: publisherId});
    }
});
