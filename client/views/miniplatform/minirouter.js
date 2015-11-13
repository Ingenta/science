//数据库表
Meteor.subscribe('news_contact');
Meteor.subscribe('news_link');
Meteor.subscribe('news_center');
Meteor.subscribe('news_recommend');
Meteor.subscribe('files');
Meteor.subscribe('column');
Meteor.subscribe('column_views');
Meteor.subscribe('images');
//访问路径
Router.map(function () {
    //新闻平台首页
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('news_recommend'),
                Meteor.subscribe('column'),
                Meteor.subscribe('news_link'),
                Meteor.subscribe('news_center'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext')
            ]
        }
    });

    //作者中心
    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout"
    });

    //出版合作
    this.route("cooperation", {
        path: "/miniplatform/cooperation",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                Meteor.subscribe('images')
            ]
        }
    });

    //新闻中心
    this.route("newsCenter", {
        path: "/miniplatform/newsCenter",
        layoutTemplate: "miniLayout"
    });

    //联系我们
    this.route("contact", {
        path: "/miniplatform/contact",
        layoutTemplate: "miniLayout"
    });

    //关于我们-杂志社简介
    this.route("magazineProfile", {
        path: "/miniplatform/magazineProfile",
        layoutTemplate: "miniLayout"
    });

    //关于我们-理事会
    this.route("council", {
        path: "/miniplatform/council",
        layoutTemplate: "miniLayout"
    });

    //关于我们-两刊大事记
    this.route("memorabilia", {
        path: "/miniplatform/memorabilia",
        layoutTemplate: "miniLayout"
    });

    //关于我们-企业文化
    this.route("enterpriseCulture", {
        path: "/miniplatform/enterpriseCulture",
        layoutTemplate: "miniLayout"
    });

    //订阅信息
    this.route("subscription", {
        path: "/miniplatform/subscription",
        layoutTemplate: "miniLayout"
    });

    //更多新闻
    this.route("newsShow", {
        path: "/miniplatform/newsShow",
        layoutTemplate: "miniLayout"
    });

    //更多杂志社动态
    this.route("dynamicShow", {
        path: "/miniplatform/dynamicShow",
        layoutTemplate: "miniLayout"
    });

    //更多最新文章
    this.route("dynamicArticleShow", {
        path: "/miniplatform/dynamicArticleShow",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('news_link'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articlesWithoutFulltext')
            ]
        }
    });

    //关于我们-企业文化-详情页
    this.route("enterpriseCultureDetails", {
        path: "/miniplatform/enterpriseCulture/:cultureId",
        layoutTemplate: "miniLayout"
    });

    //新闻中心详情页
    this.route("newsCenterDetails", {
        path: "/miniplatform/newsCenter/:newsCenterId",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                Meteor.subscribe('news_center')
            ]
        }
    });

    //专栏详情页
    this.route("columnViewsDetails", {
        path: "/miniplatform/:columnId",
        layoutTemplate: "miniLayout"
    });

    //门户搜索
    this.route("newsSearchShowPage", {
        path: "/miniplatform/newsSearchShowPage/:searchQuery",
        layoutTemplate: "miniLayout"
    });
});