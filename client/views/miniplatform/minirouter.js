//访问路径
Router.map(function () {
    //新闻平台首页
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_recommend'),
                MiniPlatformSubs.subscribe('column'),
                MiniPlatformSubs.subscribe('news_center'),
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                MiniPlatformSubs.subscribe('recommendedMiniPlatformArticles'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //作者中心
    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                MiniPlatformSubs.subscribe('news_link')
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
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_center'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //联系我们
    this.route("contact", {
        path: "/miniplatform/contact",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //关于我们-杂志社简介
    this.route("magazineProfile", {
        path: "/miniplatform/magazineProfile",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //关于我们-理事会
    this.route("council", {
        path: "/miniplatform/council",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //关于我们-两刊大事记
    this.route("memorabilia", {
        path: "/miniplatform/memorabilia",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //关于我们-企业文化
    this.route("enterpriseCulture", {
        path: "/miniplatform/enterpriseCulture",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //订阅信息
    this.route("subscription", {
        path: "/miniplatform/subscription",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                Meteor.subscribe('files'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //更多新闻
    this.route("newsShow", {
        path: "/miniplatform/newsShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_center'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //更多杂志社动态
    this.route("dynamicShow", {
        path: "/miniplatform/dynamicShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_center'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //更多最新文章
    this.route("dynamicArticleShow", {
        path: "/miniplatform/dynamicArticleShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                HomePageSubs.subscribe('publishers'),
                HomePageSubs.subscribe('publications'),
                MiniPlatformSubs.subscribe('recommendedMiniPlatformArticles'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //关于我们-企业文化-详情页
    this.route("enterpriseCultureDetails", {
        path: "/miniplatform/enterpriseCulture/:cultureId",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_contact'),
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });

    //新闻中心详情页
    this.route("newsCenterDetails", {
        path: "/miniplatform/newsCenter/:newsCenterId",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                MiniPlatformSubs.subscribe('news_center'),
                Meteor.subscribe('files'),
                MiniPlatformSubs.subscribe('news_link')
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
                MiniPlatformSubs.subscribe('column_views'),
                MiniPlatformSubs.subscribe('news_link')
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
                MiniPlatformSubs.subscribe('news_link')
            ]
        }
    });
});