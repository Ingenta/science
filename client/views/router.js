Router.configure({
    templateNameConverter: "upperCamelCase",
    routeControllerNameConverter: "upperCamelCase",
    layoutTemplate: "layout",
    notFoundTemplate: "notFound",
    loadingTemplate: "loading",
    progressDelay: 100,
    progressSpinner: false
});
var subs = new SubsManager();

subs.subscribe("current_user_data");
subs.subscribe('pages');
subs.subscribe('images');
subs.subscribe('advertisement');
subs.subscribe('institutions');
subs.subscribe('searchHistory');
subs.subscribe('emailConfig');
subs.subscribe('publishers');
subs.subscribe('publications');

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
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('files'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe("journal_ad")
            ]
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
                Meteor.subscribe('mostRead')
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
                Meteor.subscribe('mostRead',this.params.journalId)
            ]
        }
    });

    this.route('/mostCitedArticles', {
        template: "mostCiteArticle",
        title: function () {
            return TAPi18n.__("Most cited by");
        },
        parent: "home",
        name: "mostCite.show",
        waitOn: function () {
            return [
                Meteor.subscribe('mostCited')
            ]
        }
    });

    this.route('/mostCitedArticles/:journalId', {
        template: "mostCiteArticle",
        title: function () {
            return TAPi18n.__("Most cited by");
        },
        parent: "home",
        name: "mostCite.showWithJournalId",
        waitOn: function () {
            return [
                Meteor.subscribe('mostCited',this.params.journalId)
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
                Meteor.subscribe('oneJournalArticles', Session.get('currentJournalId')),
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
        template: "publisherAccountTemplate",
        name: "publisher.account",
        parent: "home",
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
            Permissions.check("use-publisher-panel", "publisher",{publisher:this.params.pubId});
            /*BEFORE_FUNCTION*/
            this.next();
        },
        data: function () {
            return {
                scope: {publisher: [this.params.pubId]}
            };
        }
    });

    this.route("/publisher/account/insert/:pubId", {
        template: "AdminUsersInsert",
        name: "publisher.account.insert",
        parent: "publisher.account",
        title: function () {
            return TAPi18n.__("Add new user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                Meteor.subscribe('publishers')
            ]
        },

        onBeforeAction: function () {
            Permissions.check("add-user", "user",{publisher:this.params.pubId});
            this.next();
        }
    });

    this.route("/publisher/account/edit/:userId", {
        template: "AdminUsersEdit",
        name: "publisher.account.edit",
        parent: "publisher.account",
        title: function () {
            return TAPi18n.__("Edit user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                Meteor.subscribe('publishers')
            ]
        },
        onBeforeAction: function() {
            var scope = {};
            var user = Users.findOne({_id:this.params.userId},{fields:{publisherId:1,institutionId:1}});
            if(user.publisherId)
                scope.publisher=user.publisherId;
            if(user.institutionId)
                scope.institution=user.institutionId;
            if (!Permissions.userCan("modify-user","user",Meteor.userId(),scope))
                Router.go('home')
            this.next();
        },
        data: function() {
            return {
                params: this.params || {},
                currUser: Users.findOne({_id:this.params.userId}, {})
            };
        }
    });


    //this.route("testTemplate", {
    //    path: "/testTemplate"
    //});
    //this.route("editseaTemp", {
    //    path: "/editseaTemp"
    //});
    //this.route("searchResult", {
    //    path: "/searchResult"
    //});
    //this.route("loginNew", {
    //    path: "/loginNew"
    //});
    //this.route("userAgreement", {
    //    path: "/userAgreement"
    //});
    //this.route("publishCont", {
    //    path: "/publishCont"
    //});
    //this.route("publishRecommed", {
    //    path: "/publishRecommed"
    //});
    //this.route("publishAuthor", {
    //    path: "/publishAuthor"
    //});
    //this.route("personal1", {
    //    path: "/personal1"
    //});
    //this.route("news", {
    //    path: "/news"
    //});
    //this.route("edit_author", {
    //    path: "/edit_author"
    //});
});
