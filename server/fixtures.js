Meteor.startup(function () {

    //Topics.remove({})
    if (Topics.find().count() === 0) {
        var names = [
            {
                e: "Science", c: "科学", sub: [
                {e: "Mathematics", c: "数理科学"},
                {e: "Chemistry", c: "化学"},
                {e: "Biology", c: "生物学"},
                {e: "Earth sciences and environment ", c: "地球科学与环境"},
                {e: "Science | Philosophy | Psychology", c: "科学 | 哲学 | 心理学"},
                {e: "Archaeology and history of science and technology", c: "考古学与科技史"},
                {e: "Economics | Management Science | Law", c: "经济学 | 管理学 | 法学"},
                {e: "Popularization of science", c: "科普"}
            ]
            },
            {
                e: "Technology", c: "技术", sub: [
                {e: "Engineering basic science", c: "工程基础科学"},
                {e: "Electronics | Communications | Electro-optical technology", c: "电子 | 通信 | 光电技术"},
                {e: "Computer and information technology", c: "计算机与信息技术"},
                {e: "Civil Engineering | Planning | Water conservation", c: "土木建筑 | 规划 | 水利"},
                {e: "Materials science and new technology", c: "材料科学与新技术"},
                {e: "Electrical | Automation | Instrumentation", c: "电气 | 自动化 | 仪表"},
                {e: "Energy | Transportation | Spaceflight", c: "能源 | 交通 | 航天"},
                {e: "Safety technology | Disaster prevention and relief ", c: "安全技术 | 防灾救灾"},
                {e: "Chemical engineering | Metallurgy | Mining ", c: "化工 | 冶金 | 矿业 "},
                {e: "Machinery |  Light industry  | Food industry", c: "机械 | 轻工 | 食品"},
                {e: "Agroforestry technology", c: "农林技术"},
                {e: "General engineering technology", c: "总论工程技术"}
            ]
            },
            {
                e: "Medicine", c: "医学", sub: [
                {e: "General practice | Anthology | Reference", c: "总论 | 文集 | 工具书"},
                {e: "Clinical medicine", c: "临床医学"},
                {e: "Preclinical medicine", c: "基础医学"},
                {e: "Preventive medicine | Hygienics", c: "预防医学 | 卫生学"},
                {e: "Traditional Chinese medicine", c: "中医药学"},
                {e: "Pharmaceutical", c: "药学 "},
                {e: "Special medicine", c: "特种医学"},
                {e: "Medical textbook", c: "医学教材"},
                {e: "Medical exams | Exercise books", c: "医学考试 | 教辅"},
                {e: "Related subjects", c: "医药相关学科"}
            ]
            },
            {
                e: "Education", c: "教育", sub: [
                {e: "Science", c: "理科类"},
                {e: "Engineering", c: "工科类"},
                {e: "Agriculture and forestry", c: "农林类"},
                {e: "Medicine", c: "医学类"},
                {e: "Economic management method", c: "经管法"},
                {e: "Language  |  Literature  |  Art", c: "语言  |  文学  |  艺术类"},
                {e: "Pedagogy", c: "师范类"}
            ]
            }
        ];
        _.each(names, function (name) {
            Topics.insert({
                name: name.c,
                englishName: name.e
            });

            _.each(name.sub, function (subName) {
                var parent = Topics.findOne({'name': name.c});
                Topics.insert({
                    parentId: parent._id,
                    name: subName.c,
                    englishName: subName.e
                });
            });

        });
    }

    if (Pages.find().count() === 0) {
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
            {key: "specialTopics", e: "Special Topics", c: "专题推荐"},
            {key: "cooperation", e: "Publishing Cooperation", c: "出版合作"},
            {key: "contact", e: "Contact Us", c: "联系我们"},
            {key: "magazineProfile", e: "Magazine Profile", c: "杂志社简介"},
            {key: "council", e: "Council", c: "理事会"},
            {key: "memorabilia", e: "Two Issue Of Memorabilia", c: "两刊大事记"},
            {key: "subscription", e: "Subscription Info", c: "订阅信息"}
        ];
        _.each(names, function (name) {
            Pages.insert({
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
            {key: "emailThis", s: "Email This", b: "email body"},
            {key: "watchJournal", s: "Watch this journal", b: "email body"}
        ];
        _.each(emails, function (email) {
            EmailConfig.insert({
                key: email.key,
                subject: email.s,
                body: email.b
            });
        });
    }
});