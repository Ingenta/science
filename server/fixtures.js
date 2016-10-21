Meteor.startup(function () {

    //Topics.remove({})
    if (Topics.find().count() === 0) {
        logger.info("importing Topic data from /assets/app/topics.json");
        var topicsFile = process.cwd() + "/assets/app/topics.json";
        if (!Science.FSE.existsSync(topicsFile))
            return;
        var content = Science.FSE.readFileSync(topicsFile, "utf-8");
        var names = JSON.parse(content);

        _.each(names, function (name) {
            //if it a parent node insert it first
            //then insert its children
            //then those childrens' children
            if(!name.level2cn&&!name.level2en&&!name.level3cn&&!name.level3en){
                //this must be a level one node
                Topics.insert({
                    name: name.level1cn,
                    englishName: name.level1en
                });
            }
            else if(!name.level3cn&&!name.level3en){
                //this must be a level two node
                var parent = Topics.findOne({'name': name.level1cn});
                Topics.insert({
                    parentId: parent._id,
                    name: name.level2cn,
                    englishName: name.level2en
                });
            }
            else{
                //this must be a level 3 node
                var parent = Topics.findOne({'name': name.level2cn});
                Topics.insert({
                    parentId: parent._id,
                    name: name.level3cn,
                    englishName: name.level3en
                });
            }
        });
    }

    if (PageHeadings.find().count() === 0) {
        var names = [
            {key: "homepage", e: "", c: ""},
            {key: "publisher", e: "Publishers", c: "出版商"},
            {key: "publication", e: "Publications", c: "出版物"},
            {key: "topic", e: "Topics", c: "主题"},
            {key: "collections", e: "Collections", c: "文章集"},
            {key: "author center", e: "Author Center", c: "作者中心"},
            {key: "institutions", e: "Institution", c: "机构中心"},
            {key: "advancedSearch", e: "Advanced Search", c: "高级检索"},
            {key: "favorite", e: "My Favorite", c: "我的收藏"},
            {key: "watch", e: "My Alerts", c: "我的关注"},
            {key: "searchHistory", e: "Search History", c: "搜索历史"},
            {key: "tags", e: "Journal label", c: "期刊收录类型"},
            {key: "contentType", e: "Articles Column Tags", c: "文章栏目类型"},
            {key: "specialTopics", e: "Special Topics", c: "专题推荐"},
            {key: "adCenter", e: "Advertisement Center", c: "广告中心"},
            {key: "cooperation", e: "Publishing Cooperation", c: "出版合作"},
            {key: "newsCenter", e: "News Center", c: "新闻中心"},
            {key: "contact", e: "Contact Us", c: "联系我们"},
            {key: "magazineProfile", e: "Magazine Profile", c: "杂志社简介"},
            {key: "council", e: "Council", c: "两刊理事会"},
            {key: "chiefEditor", e: "Chief Editor", c: "两刊总主编"},
            {key: "memorabilia", e: "Two Issue Of Memorabilia", c: "两刊大事记"},
            {key: "subscription", e: "Subscription", c: "期刊订阅"},
            {key: "enterpriseCulture", e: "Enterprise Culture", c: "企业文化"}
        ];
        _.each(names, function (name) {
            PageHeadings.insert({
                key: name.key,
                title: {cn: name.c, en: name.e}
            });
        });
    }

    if (EmailConfig.find().count() === 0) {
        var emails = [
            {
                key: "forgotPassword",
                s: "《中国科学》杂志社平台重置您的密码 Reset Password",
                b: "<p>请点击下面的链接以重置您的密码 To reset your password, simply click the link below:</p>"
            },
            {
                key: "registration",
                s: "欢迎使用《中国科学》杂志社平台 Welcome to the China Science Publishing",
                b: "<p>《中国科学》杂志社平台邀请您开通账号, 请点击下方的链接以激活您的账号。</p><p>You have been invited to the China Science Publishing platform, please click on the link below to activate your account.</p>"
            },
            {
                key: "verifyEmail",
                s: "《中国科学》杂志社平台 账号激活邮件 Confirm Your Email Address",
                b: "<p>欢迎使用《中国科学》杂志社平台，请点击下方的链接以激活您的账号 Welcome to the China Science Publishing, please click the link below to activate your account.</p>"
            },
            {
                key: "emailThis",
                s: "《中国科学》杂志社平台 个人推荐 Email This",
                b: "<p>The following content has been recommended to you.</p>"
            },
            {
                key: "watchJournal",
                type: "alert",
                s: "《中国科学》杂志社平台 期刊关注 Watch this journal",
                b: "<p>You are watching a journal of which the following articles have been added.</p>"
            },
            {
                key: "watchTopic",
                type: "alert",
                s: "《中国科学》杂志社平台 主题关注 Watch this topic",
                b: "<p>You are watching a topic of which the following articles have been added.</p>"
            },
            {
                key: "watchArticle",
                type: "alert",
                s: "《中国科学》杂志社平台 文章关注 Watch this article",
                b: "<p>You are watching an article of which the following changes have been made.</p>"
            },
            {
                key: "keywordFrequency",
                type: "alert",
                s: "高频词语提醒",
                b: "not used"
            },
            {
                key: "availableOnline",
                type: "alert",
                s: "优先出版",
                b: "not used"
            },
            {
                key: "articleCitedAlert",
                type: "alert",
                s: "文章引用提醒",
                b: "not used"
            }
        ];

        _.each(emails, function (email) {
            EmailConfig.insert({
                key: email.key,
                isAlert: email.type,
                subject: email.s,
                body: email.b
            });
        });
    }
    if (JET.store.find().count() === 0) {
        var templateFolder = process.cwd() + "/assets/app/template/";
        if (!Science.FSE.existsSync(templateFolder))
            return;

        var files = Science.FSE.readdirSync(templateFolder);
        if (_.isEmpty(files))
            return;

        var templates = {};
        _.each(files, function (file) {
            var content = Science.FSE.readFileSync(templateFolder + file, "utf-8");
            var name = Science.String.getFileNameWithOutExt(file);
            var ext = Science.String.getExt(file);
            if (!templates[name]) {
                templates[name] = {};
            }
            templates[name][ext] = ext === "json" ? JSON.parse(content) : content;
        });
        _.each(templates, function (content, key) {
            if (content.html) {
                JET.store.insert({
                    name: key,
                    description: key,
                    content: content.html,
                    previewData: content.json
                })
            }
        })
    }

    if (pacs.find().count() === 0) {
        logger.info("importing PACS data from /assets/app/pacs.json");
        var pacsFile = process.cwd() + "/assets/app/pacs.json";
        if (!Science.FSE.existsSync(pacsFile))
            return;
        var content = Science.FSE.readFileSync(pacsFile, "utf-8");
        var pacsArr = JSON.parse(content);
        _.each(pacsArr, function (obj) {
            pacs.insert(obj);
        })
    }
});