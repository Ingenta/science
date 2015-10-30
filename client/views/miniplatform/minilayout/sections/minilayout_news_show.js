Template.layoutNewsShow.helpers({
    layoutNewsShow: function (type) {
        var n = NewsCenter.find({recommend:"2"},{sort: {createDate: -1}, limit: 3});
        if (type == 'extend') {
            n = n.map(function (newsItem, index) {
                newsItem.index = index;
                newsItem.class = index == 0 ? "active" : "";
                return newsItem;
            });
            if (Session.get("renderd")) {
                var nums = $(".index-num");
                _.each(nums, function (item, index) {
                    $(item).attr('index', index);
                });
                $(".carousel-inner .item").removeClass("next").removeClass("left");
                var item = $(".carousel-inner .item");
                if (item && item.length) {
                    $(item[0]).addClass('active');
                }
                var indicators = $(".carousel-indicators li");
                if (indicators && indicators.length) {
                    $(indicators[0]).addClass('active');
                }
            }
        }
        return n;
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/newsCenter/" + this._id;
    }
});

Template.layoutNewsShow.events({
    'mouseenter .index': function (event) {
        var index = $(event.currentTarget).attr('index');
        $('#myCarousel').carousel(parseInt(index))
    }
});

Template.layoutNewsShow.onRendered(function () {
    Session.set("renderd", true);
});