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
            {key: "tags", e: "Journal label", c: "期刊收录标签"},
            {key: "specialTopics", e: "Special Topics", c: "专题推荐"}
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
            {key: "forgotPassword", e: "Forgot password", c: "email body"},
            {key: "registration", e: "Registration", c: "email body"},
            {key: "emailThis", e: "Email This", c: "email body"},
            {key: "watchJournal", e: "Watch this journal", c: "email body"}
        ];
        _.each(emails, function (email) {
            EmailConfig.insert({
                key: email.key,
                subject:  email.e,
                body : email.c
            });
        });
    }

    if(IP2Country.find().count() ===0 ){
        console.log("import ip-country data, please wait ……");
        var dataReader = Science.FSE.readline( process.cwd() + "/assets/app/ip2country_fixture.txt");
        dataReader
            .on('line',Meteor.bindEnvironment(function(line,lineCount,byteCount){//lineCount:行号,byteCount:总字节数
                var obj = JSON.parse(line);
                IP2Country.insert(obj);
                //console.log(lineCount + ":\t" + obj.detail);
            }))
            .on('error',Meteor.bindEnvironment(function(err){
                console.log(err);//用于检查错误 for debug
            }))
    }
});