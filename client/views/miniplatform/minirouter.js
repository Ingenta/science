//数据库表
Meteor.subscribe('news_contact');
Meteor.subscribe('news_link');
Meteor.subscribe('news_center');
Meteor.subscribe('news_recommend');
Meteor.subscribe('files');

//访问路径
Router.map(function () {
    //新闻平台首页
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout"
    });

    //作者中心
    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout"
    });

    //作者中心详情
    this.route("journalArticle", {
        path: "/miniplatform/authorCentered/:journalTitle",
        layoutTemplate: "miniLayout",
        data: function () {
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (journal) {
                Session.set('currentJournalId', journal._id);
                return journal;
            }
        }
    });

    //出版合作
    this.route("cooperation", {
        path: "/miniplatform/cooperation",
        layoutTemplate: "miniLayout"
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

    //关于我们-企业文化-详情页
    this.route("enterpriseCultureDetails", {
        path: "/miniplatform/enterpriseCulture/:cultureId",
        layoutTemplate: "miniLayout"
    });

    //新闻中心详情页
    this.route("newsCenterDetails", {
        path: "/miniplatform/newsCenter/:newsCenterId",
        layoutTemplate: "miniLayout"
    });
});