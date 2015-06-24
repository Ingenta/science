Template.HomePrivate.rendered = function() {

};

Template.NewsList.events({
    'mouseenter .index':function(event){
        var index = $(event.currentTarget).attr('index');
        $('#myCarousel').carousel(parseInt(index))
    }
});

Template.HomePrivate.helpers({

});


Template.NewsList.helpers({
    news: function () {
        return News.find();
    }
});

Template.deleteNewsModalForm.helpers({
  getPrompt: function () {
    return TAPi18n.__("Are you sure?");
  }
});

Template.newestUpload.helpers({
     newarticle: function () {
     return Articles.find()
  }
});

Template.SingleNews.helpers({
    hasNews: function (id) {
        return  News.find({"news": id}).count()===0;
    }
});

AutoForm.addHooks(['addNewsModalForm'], {
  onSuccess: function () {
    $("#addNewsModal").modal('hide');
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  }
}, true);

AutoForm.addHooks(['cmForm'], {
  onSuccess: function () {
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  }
}, true);
