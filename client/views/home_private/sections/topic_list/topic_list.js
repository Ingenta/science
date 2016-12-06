Template.homePageTopicList.helpers({
    topics: function () {
        return [
            {name: "组合论", englishName: "Combinatorics"},
            {name: "数论", englishName: "Number Theory"},
            {name: "代数几何", englishName: "Algebraic Geometry"},
            {name: "无机化学", englishName: "Inorganic Chemistry"},
            {name: "有机化学", englishName: "Organic Chemistry"},
            {name: "物理化学", englishName: "Physical Chemistry"},
            {name: "植物学", englishName: "Botany"},
            {name: "动物学", englishName: "Zoology"},
            {name: "微生物学", englishName: "Microbiology"},
            {name: "地质学", englishName: "Geology"},
            {name: "大气科学", englishName: "Atmospheric sciences"},
            {name: "海洋科学", englishName: "Oceanography"},
            {name: "材料科学与工程", englishName: "Materials Science and Engineering"},
            {name: "机械工程", englishName: "Mechanical Engineering"},
            {name: "航空航天科学技术", englishName: "Aviation & Aerospace"},
            {name: "智能控制", englishName: "Intelligent Control"},
            {name: "计算机科学与技术", englishName: "Computer Science & Technology"},
            {name: "计算机图形与图像", englishName: "Computer Graphics"},
            {name: "量子物理", englishName: "Quantum Physics"},
            {name: "固体力学", englishName: "Solid Mechanics"},
            {name: "凝聚态物理学", englishName: "Condensed Matter Physics"}
        ];
    },
    searchUrl: function (name){
        var topic = Topics.findOne({englishName:name});
        if(!topic)return;
        var option = {
            filterQuery: {
                topic: [topic._id]
            },
            setting: {from: 'topic'}
        };
        return SolrQuery.makeUrl(option);
    }
});
