Router.configure({
    templateNameConverter: "upperCamelCase",
    routeControllerNameConverter: "upperCamelCase",
    layoutTemplate: "layout",
    notFoundTemplate: "notFound",
    loadingTemplate: "loading",
    progressDelay: 100,
    progressSpinner: false
});

Meteor.subscribe("current_user_data");
Meteor.subscribe("issues");
Meteor.subscribe("about");
Meteor.subscribe("tag");
Meteor.subscribe("file_excel");
Meteor.subscribe("journal_ad");
Meteor.subscribe("volumes");
Meteor.subscribe("about_articles");
Meteor.subscribe("editorial_member");
Meteor.subscribe("editorial_board");
Meteor.subscribe("meeting_info");
Meteor.subscribe("author_center");
Meteor.subscribe('articleXml');
Meteor.subscribe('pages');
Meteor.subscribe('news');
Meteor.subscribe('images');
Meteor.subscribe('advertisement');
Meteor.subscribe('articleViews');
Meteor.subscribe('institutions');
Meteor.subscribe('mostCited');
Meteor.subscribe('specialTopics');
Meteor.subscribe('searchHistory');
Meteor.subscribe('articleUrls');

Router.onBeforeAction(function () {
    // loading indicator here
    if (!this.ready()) {
        $("body").addClass("wait");
    } else {
        $("body").removeClass("wait");
        this.next();
    }
});

Router.map(function () {

    this.route("home", {
        path: "/",
        controller: "HomePrivateController",
        title: function () {
            return TAPi18n.__("Home");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('mostRecentArticles'),
                Meteor.subscribe('articleViews'),
                Meteor.subscribe('topics'),
                Meteor.subscribe('images'),
                Meteor.subscribe('news'),
                Meteor.subscribe('suggestedMostRead')
            ]
        }
    });

    this.route("publishers", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Publishers");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers')
            ]
        }
    });

    this.route("publications", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Publications");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('publishers')
            ]
        }
    });

    this.route('/publisher/:publisherName', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            if (pub) {
                Session.set('currentPublisherId', pub._id);
                Session.set('filterPublisher', pub._id);
                return pub;
            }

        },
        template: "ShowPublisher",
        parent: "publishers",
        title: function () {
            if (TAPi18n.getLanguage() === "en") return ":publisherName";
            var id = Session.get('currentPublisherId');
            var p = Publishers.findOne({_id: id});
            if (p) return p.chinesename || p.name;
            return ":publisherName";
        },
        name: "publisher.name",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('allCollections'),
                Meteor.subscribe('topics')
            ]
        }
    });

    this.route('/publisher/:publisherName/journal/:journalTitle', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (journal) {
                Session.set('currentJournalId', journal._id);
                Session.set('currentPublisherId', pub._id);
                return journal;
            }
        },
        template: "ShowJournal",
        title: function () {
            if (TAPi18n.getLanguage() === "en") return ":journalTitle";
            var id = Session.get('currentJournalId');
            var p = Publications.findOne({_id: id});
            if (p) return p.titleCn || p.title;
            return ":journalTitle";
        },
        parent: "publisher.name",
        name: "journal.name",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('oneJournalArticles', Session.get('currentJournalId')),
                Meteor.subscribe('about'),
                Meteor.subscribe('about_articles'),
                Meteor.subscribe('allCollections'),
                Meteor.subscribe('medias'),
                Meteor.subscribe('files'),
                Meteor.subscribe('topics'),
                Meteor.subscribe('specialTopics'),
                Meteor.subscribe('suggestedMostRead'),
                Meteor.subscribe('recommend')
            ]
        }

    });

    this.route('/publisher/:publisherName/journal/:journalTitle/:volume/:issue', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            Session.set("activeTab", "Browse");
            if (journal) {
                var i = Issues.findOne({journalId: journal._id, volume: this.params.volume, issue: this.params.issue});
                if (i !== undefined) {
                    Session.set("currentIssueId", i._id);
                }
                Session.set('currentJournalId', journal._id);
                Session.set('currentPublisherId', pub._id);
                return journal;
            }
        },
        template: "ShowJournal",
        name: "journal.name.volume",
        parent: "journal.name",
        title: function () {
            return TAPi18n.__("volumeItem", Router.current().params.volume) + ", " + TAPi18n.__("issueItem", Router.current().params.issue)
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('about'),
                Meteor.subscribe('about_articles'),
                Meteor.subscribe('medias'),
                Meteor.subscribe('files'),
                Meteor.subscribe('suggestedMostRead')
            ]
        }

    });

    this.route('/publisher/:publisherName/journal/:journalTitle/:volume/:issue/:publisherDoi/:articleDoi', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (pub) {
                journal && Session.set('currentJournalId', journal._id);
                pub && Session.set('currentPublisherId', pub._id);
                return Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
            }
        },
        template: "showArticle",
        title: function () {
            return TAPi18n.__("Article");
        },
        parent: "journal.name.volume",
        name: "article.show",
        waitOn: function () {
            var artData = this.data();
            var artId;
            if (artData)artId = artData._id;
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articleViews'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('oneArticle', artId),
                Meteor.subscribe('keywords'),
                Meteor.subscribe('articleXml'),
                Meteor.subscribe('pdfs'),
                Meteor.subscribe('emailConfig')
            ]
        },
        onBeforeAction: function () {
            if (Session.get("ipInChina") === undefined) {
                Meteor.call("ipInChina", function (err, result) {
                    console.log(result.country ? result.country.country.cn : "No country found!");
                    Session.set("ipInChina", result.code);
                })
            }
            this.next();
        },
        onStop: function () {
            Meteor.clearInterval(Session.get("dynamicRender"));
        }
    });

    this.route("author", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Author");
        }
    });

    this.route('cooperationCenter', {
        template: "cooperationCenter",
        parent: "home",
        name: "cooperationCenter",
        title: function () {
            return TAPi18n.__("Ad Center");
        }
    });


    this.route('mostReadArticles', {
        template: "mostReadArticle",
        title: function () {
            return TAPi18n.__("Most read articles");
        },
        parent: "home",
        name: "mostRead.show",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('files'),
                Meteor.subscribe('suggestedMostRead')
            ]
        }
    });

    this.route('mostReadArticles/:journalId', {
        template: "mostReadArticle",
        title: function () {
            return TAPi18n.__("Most read articles");
        },
        parent: "home",
        name: "mostRead.showWithJournalId",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('files'),
                Meteor.subscribe('suggestedMostRead')
            ]
        }
    });

    this.route('/mostCiteArticles', {
        template: "mostCiteArticle",
        title: function () {
            return TAPi18n.__("Most cited by");
        },
        parent: "home",
        name: "mostCite.show",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('files')
            ]
        }
    });

    this.route('/mostCiteArticles/:journalId', {
        template: "mostCiteArticle",
        title: function () {
            return TAPi18n.__("Most cited by");
        },
        parent: "home",
        name: "mostCite.showWithJournalId",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('files')
            ]
        }
    });

    this.route('mostEditorRecommend', {
        template: "mostRecommendArticles",
        title: function () {
            return TAPi18n.__("Editors Recommend");
        },
        parent: "home",
        name: "mostEditor.show",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('files'),
                Meteor.subscribe('recommend')
            ]
        }
    });

    this.route("advancedSearch", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Advanced Search");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('publications'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('topics')
            ]
        }
    });


    this.route('/news/:newsId', {
        template: "showNewsArticle",
        title: function () {
            return TAPi18n.__("News");
        },
        parent: "home",
        name: "news.show",
        waitOn: function () {
            return [
                Meteor.subscribe('news')
            ]
        }
    });

    this.route('/publisher/account/:pubId', {
        template: "Admin",
        name: "publisher.account",
        parent: "home",
        yieldTemplates: {
            'publisherAccountTemplate': {to: 'AdminSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Publisher");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                Meteor.subscribe('publishers')
            ]
        },
        onBeforeAction: function () {
            Permissions.check("add-user", "user");
            /*BEFORE_FUNCTION*/
            this.next();
        },
        data: function () {
            return {
                admin_users: Users.find({publisherId: this.params.pubId})
            };
        }
    });

    this.route("/publisher/account/insert/:pubId", {
        template: "Admin",
        name: "publisher.account.insert",
        parent: "publisher.account",
        title: function () {
            return TAPi18n.__("Add new user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                Meteor.subscribe('publishers'),
            ]
        },
        controller: "AdminUsersInsertController"
    });

    this.route("/publisher/account/edit/:userId", {
        template: "Admin",
        name: "publisher.account.edit",
        parent: "publisher.account",
        title: function () {
            return TAPi18n.__("Edit user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                Meteor.subscribe('publishers'),
            ]
        },
        controller: "AdminUsersEditController"
    });



    this.route('/specialTopics/:specialTopicsId', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (journal) {
                Session.set('currentJournalId', journal._id);
                Session.set('currentPublisherId', pub._id);
                return journal;
            }
        },
        template: "addArticleForSpecialTopics",
        name: "specialTopics.selectArticles",
        parent: "home",
        title: function () {
            return TAPi18n.__("addSpecialTopicsToCollection");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('articlesWithoutFulltext'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('specialTopics')
            ]
        }
    });

    this.route('/publisher/:publisherName/journal/:journalTitle/guide/:guideId', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (journal) {
                Session.set('currentJournalId', journal._id);
                Session.set('currentPublisherId', pub._id);
                return journal;
            }
        },
        template: "ShowGuidelines",
        title: function () {
            return TAPi18n.__("Guide for Authors");
        },
        parent: "journal.name",
        name: "guidelines.show",
        waitOn: function () {
            return [
                Meteor.subscribe("author_center")
            ]
        }

    });

    this.route("testTemplate", {
        path: "/testTemplate"
    });
    this.route("editseaTemp", {
        path: "/editseaTemp"
    });
    this.route("searchResult", {
        path: "/searchResult"
    });
    this.route("loginNew", {
        path: "/loginNew"
    });
    this.route("userAgreement", {
        path: "/userAgreement"
    });
    this.route("publishCont", {
        path: "/publishCont"
    });
    this.route("publishRecommed", {
        path: "/publishRecommed"
    });
    this.route("publishAuthor", {
        path: "/publishAuthor"
    });
    this.route("personal1", {
        path: "/personal1"
    });
    this.route("news", {
        path: "/news"
    });
    this.route("edit_author", {
        path: "/edit_author"
    });
});
