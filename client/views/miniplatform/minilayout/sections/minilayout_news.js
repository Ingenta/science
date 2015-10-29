Template.layoutRightNews.helpers({
    layoutRecommendNews: function () {
        return NewsCenter.find({recommend:"1",types:"1"},{sort: {createDate: -1}, limit: 5});
    },
    layoutRecommendMagazines: function () {
        return NewsCenter.find({recommend:"1",types:"2"},{sort: {createDate: -1}, limit: 3});
    }
});