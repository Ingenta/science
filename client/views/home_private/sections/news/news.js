var newsSlick;

Template.NewsList.events({
    'mouseenter .index': function (event) {
        event.preventDefault();
        var index = $(event.target).index();
        newsSlick.slick('slickGoTo',index);
    }
});
Template.NewsList.helpers({
    news: function () {
        return News.find({types: "1"}, {sort: {releaseTime: -1,limit: 3}});
    },
    getOptions:function(){
        return {
            dots:true,
            infinite:true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 3000,
            accessibility:true
        }
    }
});

Template.NewsList.onRendered(function () {
    //Template.instance().$('#myCarousel').owlCarousel({
    //    items:1,
    //    autoPlay:2000
    //});
    newsSlick=Template.instance().$('#news-slick').slick({
        dots:true,
        infinite:true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        accessibility:true
    })
    newsSlick.on('beforeChange',function(event,slick,currentSlide,nextSlide){
        //console.log(currentSlide)
        //Template.instance().$('index-num:eq('+currentSlide+')')
    });
});

Template.SingleNews.helpers({
    hasMoreThanOneNews: function () {
        return News.find({types: "1"}).count() > 1;
    },
    whichUrl: function () {
        return "/news/" + this._id;
    }
});


Template.SingleNews.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            News.remove({_id: id});
        })
    }
});
AutoForm.addHooks(['addNewsModalForm'], {
    onSuccess: function () {
        $("#addNewsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            // Allow upload files under 1MB
            var image = Images.findOne({_id:doc.picture});
            if(image){
                if (image.original.size <= 1048576) {
                    var newPage = _.contains(Config.Routes.NewsPage.journal, Router.current().route.getName());
                    var type = newPage ? 2 : 1;
                    doc.types = type;
                    doc.createDate = new Date();
                    return doc;
                }else{
                    $("#addNewsModal").modal('hide');
                    FlashMessages.sendError(TAPi18n.__("Upload Images Error"), {hideDelay: 30000});
                }
            }else{
                var newPage = _.contains(Config.Routes.NewsPage.journal, Router.current().route.getName());
                var type = newPage ? 2 : 1;
                doc.types = type;
                doc.createDate = new Date();
                return doc;
            }
        }
    }
}, true);

Template.addNewsButton.helpers({
    hasMostThreeNews: function () {
        return News.find({types: "1"}).count() < 3;
    }
});

AutoForm.addHooks(['updateNewsModalForm'], {
    onSuccess: function () {
        $("#jkafModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
});