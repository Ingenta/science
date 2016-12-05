//访问路径
Router.map(function () {
    //杂志社平台首页
    this.route("newsPlatform", {
        data: function () {
            var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
            if (publisher) {
                Session.set('publisherId', publisher._id);
            }
        },
        path: "/miniplatform",
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

    //作者中心
    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //出版合作
    this.route("cooperation", {
        path: "/miniplatform/cooperation",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //新闻中心
    this.route("newsCenter", {
        path: "/miniplatform/newsCenter",
        layoutTemplate: "miniLayout",
        data: function () {
            Science.setActiveTabByUrl(window.location.search,["scpNews","publishingNews"],"scpNews");
        },
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_center'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //订阅信息
    this.route("subscription", {
        path: "/miniplatform/subscription",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformSubscription'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //联系我们
    this.route("contact", {
        path: "/miniplatform/contact",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformNewsContact'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //关于我们-杂志社简介
    this.route("magazineProfile", {
        path: "/miniplatform/magazineProfile",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformMagazineProfile'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //关于我们-两刊理事会
    this.route("council", {
        path: "/miniplatform/council",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformCouncil'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //关于我们-两刊总主编
    this.route("chiefEditor", {
        path: "/miniplatform/chiefEditor",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformChiefEditor'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //关于我们-两刊大事记
    this.route("memorabilia", {
        path: "/miniplatform/memorabilia",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformMemorabilia'),
                MiniPlatformSubs.subscribe('miniPlatformHistoryNews'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //关于我们-企业文化
    this.route("enterpriseCulture", {
        path: "/miniplatform/enterpriseCulture",
        layoutTemplate: "miniLayout",
        data: function () {
            Science.setActiveTabByUrl(window.location.search,["enterNews","editCorner"],"enterNews");
        },
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformEnterNews'),
                MiniPlatformSubs.subscribe('miniPlatformEditFields'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //更多杂志社动态
    this.route("dynamicShow", {
        path: "/miniplatform/dynamicShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformMostScpNews'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //更多出版动态
    this.route("publishingShow", {
        path: "/miniplatform/publishingShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformMostPublishingNews'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //更多最新文章
    this.route("dynamicArticleShow", {
        path: "/miniplatform/dynamicArticleShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('recommendedMiniPlatformArticles',20),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //企业文化详情页
    this.route("enterpriseCultureDetails", {
        path: "/miniplatform/enterpriseCulture/:cultureId",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformCulturePage',this.params.cultureId),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //新闻中心详情页
    this.route("newsCenterDetails", {
        path: "/miniplatform/newsCenter/:newsCenterId",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('miniPlatformNews',this.params.newsCenterId),
                MiniPlatformSubs.subscribe('miniPlatformLastNews'),
                JournalSubs.subscribe('files'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //专栏详情页
    this.route("columnViewsDetails", {
        path: "/miniplatform/:columnId",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('column'),
                MiniPlatformSubs.subscribe('miniPlatformColumnViews',this.params.columnId),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });

    //门户搜索
    this.route("newsSearchShowPage", {
        path: "/miniplatform/newsSearchShowPage/:searchQuery",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_center'),
                MiniPlatformSubs.subscribe('miniPlatformCommonNewsLink')
            ]
        }
    });
});