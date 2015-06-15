Meteor.startup(function () {

    Topics.remove({})
    if (Topics.find().count() === 0) {
        var names = [
            {e:"Acoustics",c: "声学"},
            {e:"Astronomy and astrophysics",c: "天文与天体物理学报"},
            {e:"Biological physics",c: "生物物理"},
            {e:"Condensed matter physics",c: "凝聚体物理学"},
            {e:"Energy",c: "能量"},
            {e:"General physics",c: "物理"},
            {e:"Geophysics",c: "地球物理学"},
            {e:"Interdisciplinary physics",c: "跨学科物理"},
            {e:"Materials science",c: "材料科学"},
            {e:"Mathematical physics",c: "数理物理"},
            {e:"Nanotechnology",c: "纳米技术"},
            {e:"Nuclear physics",c: "核物理"},
            {e:"Optics and optical physics",c: "光学和光学物理"},
            {e:"Particle physics",c: "粒子物理学"},
            {e:"Physical chemistry",c: "物理化学"},
            {e:"Plasma physics",c: "等离子物理"},
            {e:"Quantum mechanics",c: "量子力学"},
            {e:"Rheology and fluid dynamics",c: "流变学和流体动力学"},
            {e:"Society and organization",c: "社会和组织"},
            {e:"Statistical physics",c: "统计物理"}
        ];
        _.each(names, function (name) {
            Topics.insert({
                name: name.c,
                englishName: name.e

            });
        });
        for (var i = 1; i <= 3; i++) {
            _.each(names, function (name) {
                var parent = Topics.findOne({'name': name.c});
                Topics.insert({
                    parentId: parent._id,
                    name: name.c+" "+i,
                    englishName: name.e+" "+i
                });
            });
        }
    }

    News.remove({})
    if (News.find().count() === 0) {
        for (var i = 1; i <= 3; i++) {
            News.insert({
                title: "News"+i,
                description: "本文提出汇聚群体智慧的可信软件开发新方法—— 群体化方法，该方法的核心是“群体协同、资源分享、运行监控、可信分析”，支持创新软件作品向可信软件产品转化，支持软件的可信演化."
            });
        }
    }

});
