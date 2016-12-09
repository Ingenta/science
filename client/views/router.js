Router.configure({
    templateNameConverter: "upperCamelCase",
    routeControllerNameConverter: "upperCamelCase",
    layoutTemplate: "layout",
    notFoundTemplate: "notFound",
    loadingTemplate: "loading",
    progressDelay: 100,
    progressSpinner: false,
    defaultBreadcrumbLastLink: false
});

HomePageSubs = new SubsManager();
CollectionSubs = new SubsManager();
MiniPlatformSubs = new SubsManager();
JournalSubs = new SubsManager();
ArticleSubs = new SubsManager();

HomePageSubs.subscribe("current_user_data");
Meteor.subscribe('pages');
HomePageSubs.subscribe('images');
HomePageSubs.subscribe('institutions');
HomePageSubs.subscribe('searchHistory');
HomePageSubs.subscribe('publishers');
HomePageSubs.subscribe('publications');

Router.onBeforeAction(function () {
    // loading indicator here
    if (!this.ready()) {
        $("body").addClass("wait");
    } else {
        Science.dom.clearCitationMeta();
        Science.dom.removeMeta('author');
        Science.dom.setMeta('title',TAPi18n.__("Science China Press"));
        Science.dom.setMeta('description',"Science China Press - Providing researchers with access to millions of scientific documents from journals, books, series, protocols and reference works.");
        if(this.route.getName()=='article.show' || this.route.getName()=='article.show.strange'){
            var article=this.data();
            Science.dom.setMeta('title',Science.JSON.try2GetRightLangVal(article.title,null,'en'));
            Science.dom.setMeta('description',Science.JSON.try2GetRightLangVal(article.abstract,null,'en'));
            var citationMetaTags = [];
            citationMetaTags.push({name:"citation_publisher",content:Publishers.findOne({_id:article.publisher}).name});
            citationMetaTags.push({name:'citation_title',content:Science.JSON.try2GetRightLangVal(article.title,null,'en')});
            _.isDate(article.published) && citationMetaTags.push({name:"citation_date",content:article.published.format("yyyy/MM/dd")})
            citationMetaTags.push({name:"citation_doi",content:article.doi});
            citationMetaTags.push({name:'citation_abstract',content:Science.JSON.try2GetRightLangVal(article.abstract,null,'en')});
            //-------期刊信息-------
            var journal=Publications.findOne({_id:article.journalId});
            if(journal){
                citationMetaTags.push({name:"citation_journal_title",content:journal.title});
                citationMetaTags.push({name:"citation_journal_abbrev",content:journal.shortTitle});
                citationMetaTags.push({name:"citation_issn",content:journal.issn.slice(0, 4) + "-" + journal.issn.slice(4)});
                citationMetaTags.push({name:"citation_issn",content:journal.EISSN});
            }
            //------卷期页码------
            article.volume && citationMetaTags.push({name:"citation_volume",content:article.volume});
            article.issue && citationMetaTags.push({name:"citation_issue",content:article.issue});
            (article.startPage || article.elocationId) && citationMetaTags.push({name:"citation_firstpage",content:(article.startPage || article.elocationId)})
            article.endPage && citationMetaTags.push({name:"citation_lastpage",content:article.endPage});
            //------作者信息-------
            if(!_.isEmpty(article.authors)){
                var authorNames="";
                _.each(article.authors,function(author){
                    authorNames+=Science.JSON.try2GetRightLangVal(author.fullname,null,'en')+"|";
                    citationMetaTags.push({name:"citation_author",content:Science.JSON.try2GetRightLangVal(author.fullname,null,'en')});
                    if(author.email){
                        var email=_.find(article.authorNotes,function(item){
                            return author.email==item.id;
                        })
                        if(email)
                            citationMetaTags.push({name:"citation_author_email",content:email.email})
                    }
                    if(!_.isEmpty(article.affiliations)){
                        if(_.isEmpty(author.affs)){
                            author.affs="all";
                        }
                        _.each(article.affiliations,function(item){
                            if(author.affs=="all" || _.contains(author.affs,item.id)){
                                var label=Science.JSON.try2GetRightLangVal(item.label,null,'en');
                                var affText = Science.JSON.try2GetRightLangVal(item.affText,null,'en');
                                if(affText)
                                    if(label && label.length<3 && affText.startWith(label))
                                        affText= affText.substr(label.length)
                                    if(_.isString(affText))
                                        citationMetaTags.push({name:"citation_author_institution",content:affText.trim()})
                            }
                        })
                    }
                })
                if(authorNames){
                    authorNames=authorNames.slice(0,-1);
                    Science.dom.setMeta('author',authorNames);
                }
            }
            //----url----
            citationMetaTags.push({name:"citation_abstract_html_url",content:window.location.href});
            article.pdfId && citationMetaTags.push({name:"citation_pdf_url",content:window.location.origin+"/downloadPdf/"+article._id});

            //----插入meta标签到head中---
            _.each(citationMetaTags,function(item){
                Science.dom.addMeta(item.name,item.content);
            })
        }
        $("body").removeClass("wait");
        this.next();
    }
});
Router.onAfterAction(function(){
    if(this.ready()){
        Meteor.isReadyForSpiderable = true;
    }
})
Meteor.startup(function () {
    if (Meteor.isClient) {
        //This code is needed to detect if there is a subdomain. So the system wants to know the routes of the subdomain
        var hostnameArray = document.location.hostname.split(".");
        if (hostnameArray[0] === "www"|| hostnameArray[0].startWith("www") || hostnameArray[0] === "127") {
            Router.route("home", {
                data: function () {
                    var publisher = Publishers.findOne({shortname: Config.defaultPublisherShortName});
                    if (publisher) {
                        Session.set('publisherId', publisher._id);
                    }
                },
                path: "/",
                template: "newsPlatform",
                layoutTemplate: "miniLayout",
                waitOn: function () {
                    return [
                        MiniPlatformSubs.subscribe('column'),
                        MiniPlatformSubs.subscribe('miniPlatformHomeScpNews'),
                        MiniPlatformSubs.subscribe('miniPlatformHomePublishingNews'),
                        MiniPlatformSubs.subscribe('miniPlatformHomeNewsShow'),
                        MiniPlatformSubs.subscribe('recommendedMiniPlatformArticles',7),
                        MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink'),
                        MiniPlatformSubs.subscribe('miniPlatformHomeNewsLink')
                    ]
                }
            });
        }
        else {
            Router.route("home", {
                path: "/",
                controller: "HomePrivateController",
                title: function () {
                    return TAPi18n.__("Home");
                },
                waitOn: function () {
                    return [
                        HomePageSubs.subscribe('homepageNews'),
                        HomePageSubs.subscribe('HomeAdvertisementShowPage'),
                        HomePageSubs.subscribe('images'),
                        HomePageSubs.subscribe('homepageMostRecentArticles'),
                        HomePageSubs.subscribe('homeMostReadArticle'),
                        HomePageSubs.subscribe('homepageMostCitedBrief'),
                        HomePageSubs.subscribe('topics')
                    ]
                },
                onStop: function () {
                    Science.dom.clearSelect2Record();
                }
            });
        }
    }
});


Router.route("/topics/", {
    parent: "home",
    name: "topics",
    template: "Topics",
    title: function () {
        return TAPi18n.__("Topics");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('HomeAdvertisementShowPage'),
            HomePageSubs.subscribe('topics')
        ]
    }
});

Router.route("topics/:topicsId/", {
    template: "topicsDetail",
    name: "topics.selectArticles",
    parent: "topics",
    title: function () {
        return TAPi18n.__("addArticleToCollection");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('topicsRelatedArticles', this.params.topicsId),
            HomePageSubs.subscribe('articlesInTopic', this.params.topicsId)
        ]
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
                HomePageSubs.subscribe('images'),
                HomePageSubs.subscribe('HomeAdvertisementShowPage'),
                HomePageSubs.subscribe('publishers')
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
                HomePageSubs.subscribe('images'),
                HomePageSubs.subscribe('HomeAdvertisementShowPage'),
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications')
            ]
        }
    });

    this.route('/publisher/:publisherName', {
        data: function () {
            var pub = Publishers.findOne({shortname: this.params.publisherName});
            if (pub) {
                Session.set('currentPublisherId', pub._id);
                Session.set('filterPublisher', pub._id);
                return pub;
            }
            Science.setActiveTabByUrl(window.location.search,["collections","journals"],"journals");
        },
        template: "ShowPublisher",
        parent: "publishers",
        title: function () {
            var p = Publishers.findOne({shortname: this.params.publisherName})
            if (!p)return this.params.publisherName;
            if (TAPi18n.getLanguage() === "en")return p.name || p.chinesename;
            return p.chinesename || p.name;
        },
        name: "publisher.name",
        waitOn: function () {
            return [
                HomePageSubs.subscribe('images'),
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                CollectionSubs.subscribe('allCollections'),
                HomePageSubs.subscribe('topics'),
                HomePageSubs.subscribe('tag')
            ]
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
                Meteor.subscribe("journal_ad")
            ]
        }
    });

    this.route('cooperationCenter/:adId', {
        template: "cooperationCenterDetails",
        parent: "home",
        name: "cooperationCenterDetails",
        title: function () {
            return TAPi18n.__("Ad Center");
        },
        waitOn: function () {
            return [
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
                Meteor.subscribe('homeMostReadArticle')
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
                Meteor.subscribe('journalMostReadPage', this.params.journalId)
            ]
        }
    });

    this.route('/mostCitedArticles', {
        template: "mostCitedArticleFullList",
        title: function () {
            return TAPi18n.__("Most cited articles");
        },
        parent: "home",
        name: "mostCite.show",
        waitOn: function () {
            return [
                Meteor.subscribe('homepageMostCited')
            ]
        }
    });

    this.route('/mostCitedArticles/:journalId', {
        template: "mostCitedArticleFullList",
        title: function () {
            return TAPi18n.__("Most cited articles");
        },
        parent: "home",
        name: "mostCite.showWithJournalId",
        waitOn: function () {
            return [
                Meteor.subscribe('journalMostCited', this.params.journalId)
            ]
        }
    });

    this.route('mostEditorRecommend/:journalId', {
        template: "mostRecommendArticles",
        title: function () {
            return TAPi18n.__("Editors Recommend");
        },
        parent: "home",
        name: "mostEditor.show",
        waitOn: function () {
            return [
                Meteor.subscribe('editorRecommends', this.params.journalId)
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
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                HomePageSubs.subscribe('contentType'),
                HomePageSubs.subscribe('topics'),
                HomePageSubs.subscribe('tag')
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
                Meteor.subscribe('files'),
                Meteor.subscribe('fullNewsPage', this.params.newsId)
            ]
        }
    });

    this.route('/publisherPanel/account', {
        template: "PublisherPanel",
        name: "publisher.account",
        parent: "home",
        yieldTemplates: {
            'publisherAccountTemplate': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Publisher");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                HomePageSubs.subscribe('publishers')
            ]
        },
        onBeforeAction: function () {
            Permissions.check("use-publisher-panel", "platform", {publisher: this.params.pubId});
            /*BEFORE_FUNCTION*/
            this.next();
        },
        data: function () {
            return {
                scope: {publisher: [this.params.pubId]}
            };
        }
    });

    this.route("/publisherPanel/account/insert", {
        template: "PublisherPanel",
        name: "publisher.account.insert",
        parent: "publisher.account",
        yieldTemplates: {
            'AdminUsersInsert': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Add new user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                HomePageSubs.subscribe('publishers')
            ]
        },

        onBeforeAction: function () {
            Permissions.check("add-user", "user", {publisher: this.params.pubId});
            this.next();
        }
    });

    this.route("/publisherPanel/account/edit/:userId", {
        template: "PublisherPanel",
        name: "publisher.account.edit",
        parent: "publisher.account",
        yieldTemplates: {
            'AdminUsersEdit': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Edit user");
        },
        waitOn: function () {
            Session.set("activeTab", "publisher");
            return [
                HomePageSubs.subscribe('publishers')
            ]
        },
        onBeforeAction: function () {
            var scope = {};
            var user = Users.findOne({_id: this.params.userId}, {fields: {publisherId: 1, institutionId: 1}});
            if (user.publisherId)
                scope.publisher = user.publisherId;
            if (user.institutionId)
                scope.institution = user.institutionId;
            if (!Permissions.userCan("modify-user", "user", Meteor.userId(), scope))
                Router.go('home');
            this.next();
        },
        data: function () {
            var result = {
                params: this.params || {},
                currUser: Users.findOne({_id: this.params.userId}, {})
            };
            var urs = Permissions.getUserRoles();
            var publisherManagerOne = _.find(urs, function (ur) {
                return ur.role == 'publisher:publisher-manager-from-user';
            });
            if (publisherManagerOne && publisherManagerOne.scope) {
                result.publisherScope = publisherManagerOne.scope.publisher;
            }
            return result;
        }
    });

    this.route("/publisherPanel", {
        name: "publisherPanel",
        controller: "publisherPanelController",
        parent: "home",
        title: function () {
            return TAPi18n.__("Publisher");
        }
    });

    this.route("/publisherPanel/upload", {
        template: "PublisherPanel",
        name: "publisher.upload",
        parent: "publisherPanel",
        yieldTemplates: {
            'AdminUpload': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Upload");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('uploadPage')
                //Meteor.subscribe('publishers')
            ]
        }
    });
    this.route("/publisherPanel/statistic/", {
        template: "PublisherPanel",
        name: "publisher.statistic",
        parent: "publisherPanel",
        yieldTemplates: {
            'statistic': {to: 'PublisherSubcontent'}
        },
        title: function () {
            return TAPi18n.__("Statistical Management");
        }
    });
});
