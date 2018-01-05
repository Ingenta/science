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
    var pub = getPublisherComponentByPublisherId(journal.publisher);
    if (!pub)return;
    return pub + "/journal/" + journal.shortTitle;
}
var getPublisherComponentByPublisherId = function (id) {
    var pub = Publishers.findOne({_id: id}, {fields: {shortname: 1}});
    if (!pub)return;
    return "/publisher/" + pub.shortname;
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

publisherIdToName = function (id) {
    var pub = Publishers.findOne({_id: id}, {fields: {chinesename: 1, name: 1}});
    return pub && (TAPi18n.getLanguage() === "zh-CN" ? pub.chinesename : pub.name);
}

Template.registerHelper('journalName', function (id) {
    return journalIdToName(id);
});

Template.registerHelper('publisherNameById', function (id) {
    return publisherIdToName(id);
});

Template.registerHelper('urlToArticleById', function (id) {
    if (!id)return;
    return Science.URL.articleDetail(id);
});

Template.registerHelper('urlToArticleByDoi', function (doi) {
    if (!doi)return;
    return "/doi/"+doi;
});

Template.registerHelper('urlToJournal', function (title) {
    var article = Articles.findOne({'title.en': title});
    return getJournalComponentByArticle(article);
});

Template.registerHelper('urlToJournalById', function (id) {
    return getJournalComponentByJournalId(id);
});
Template.registerHelper('urlToPublisherById', function (id) {
    return getPublisherComponentByPublisherId(id);
});

Template.registerHelper('getImageHelper', function (pictureId) {
    var noPicture = "/thumbnail.jpg";
    var imgObj = Images && pictureId && Images.findOne({_id: pictureId});
    return (imgObj && imgObj.url({auth:false})) || noPicture;
});

Template.registerHelper('getHeadImageHelper', function (pictureId) {
    var noPicture = "";
    var imgObj = Images && pictureId && Images.findOne({_id: pictureId});
    return (imgObj && imgObj.url({auth:false})) || noPicture;
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
    if(!str)return "";
    str = str.replace(/(<\/?[^>]+?>|\.)/g, '');
    return str.replace(/[^\w\d_-]/g, "-")
});

Template.registerHelper("highlight", function (keyword, str) {
    return str.split(keyword).join("<span class='highlight'>" + keyword + "</span>")
});

Template.registerHelper('permissionCheckWithScope', function (permission, package_name, scope_key, scope_value) {
    var scope = {};
    scope[scope_key] = scope_value;
    return Permissions.userCan(permission, package_name, Meteor.userId(), scope);
});

Template.registerHelper('miniPlatformPermission', function () {
    return Permissions.userCan("manage-news-platform", "platform", Meteor.userId(), {publisher: Science.defaultPublisherId});
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

Template.registerHelper('formatissn', function (issn) {
    if (!issn) return issn;
    if (!_.isString(issn)) return issn;
    if (issn.indexOf('-') > 0) return issn;
    if (issn.length == 8)
        return issn.slice(0, 4) + "-" + issn.slice(4);
})

topicCache=new ReactiveDict();

Template.registerHelper('showTopicName',function(topics){
    if(!topics) return;
    if(_.isEmpty(topics)) return;
    var topicId;
    if(_.isArray(topics) && !_.isEmpty(topics))
        topicId = topics[0];
    else if(_.isString(topics))
        topicId = topics;
    var topic = Topics.findOne({_id:topicId});
    return topic && ( TAPi18n.getLanguage()=='zh-CN'?topic.name:topic.englishName);
})

Science.setActiveTabByUrl=function(searchStr, range, defaultTab){
    if(searchStr){
        var slug = /slug=([^&#]+)/.exec(searchStr);
        if(!_.isEmpty(slug)){
            if(_.isEmpty(range) || _.contains(range,decodeURI(slug[1]))){
                Session.set("activeTab",decodeURI(slug[1]));
                return;
            }
        }
    }
    Session.set("activeTab",defaultTab);
}

Template.registerHelper('isSlugRight',function(slug){
    return Session.get("activeTab") == slug;
})