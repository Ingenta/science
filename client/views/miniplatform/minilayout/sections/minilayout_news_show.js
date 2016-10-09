Template.layoutNewsShow.helpers({
    layoutNewsShow: function (type) {
        var n = NewsCenter.find({recommend:"2"},{sort: {releaseTime: -1}, limit: 3});
        if (type == 'extend') {
            n = n.map(function (picItem, index) {
                picItem.index = index;
                picItem.class = index == 0 ? "active" : "";
                return picItem;
            });
        }
        return n;
    },
    whichUrl: function () {
        if (this.link)return this.link;
        return "/miniplatform/newsCenter/" + this._id;
    }
});

Template.layoutNewsShow.events({
    'mouseenter .index': function (event) {
        var index = $(event.currentTarget).attr('index');
        $('#carousel-example-generic').carousel(parseInt(index))
    }
});

Template.layoutNewsShow.rendered = function() {
    $('.carousel').carousel({
        interval: 8000,
        wrap:true
    });
}