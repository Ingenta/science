Template.mostReadArticle.onRendered(function() {
    $("input[id='radio']").prop({checked:true});
    Session.set("order1", "0");
    Session.set("order2", undefined);
    Session.set("order3", undefined);
});

Template.mostReadArticle.events({
    'click #radio': function () {
        if(document.getElementById("radio").checked){
            $("input[id='radio']").prop({checked:true});
            $("input[id='radio1']").prop({checked:false});
            $("input[id='radio2']").prop({checked:false});
            var name = $('#radio').val();
            Session.set("order1", name);
            Session.set("order2", undefined);
            Session.set("order3", undefined);
        }
    },
    'click #radio1': function () {
        if(document.getElementById("radio1").checked){
            $("input[id='radio']").prop({checked:false});
            $("input[id='radio1']").prop({checked:true});
            $("input[id='radio2']").prop({checked:false});
            var name = $('#radio1').val();
            Session.set("order1", undefined);
            Session.set("order2", name);
            Session.set("order3", undefined);
        }
    },
    'click #radio2': function () {
        if(document.getElementById("radio2").checked){
            $("input[id='radio']").prop({checked:false});
            $("input[id='radio1']").prop({checked:false});
            $("input[id='radio2']").prop({checked:true});
            var name = $('#radio2').val();
            Session.set("order1", undefined);
            Session.set("order2", undefined);
            Session.set("order3", name);
        }
    }
});

Template.mostReadArticle.helpers({
    mostReadArticles: function () {
        Meteor.call("getMostRead", Meteor.userId(), function (err, result) {
            Session.set("mostRead", result);
        });

        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];
        most.forEach(function (id) {
            var sort1 = Session.get("order1");
            var sort2 = Session.get("order2");
            var sort3 = Session.get("order3");
            if(sort1){
                var article = Articles.findOne({_id: id._id.articleId});
            }
            if(sort2){
                var article = Articles.findOne({_id: id._id.articleId},{sort: {createdAt: -1}});
            }
            if(sort3){
                var article = Articles.findOne({_id: id._id.articleId},{sort: {createdAt: 1}});
            }
            article && mostReadArticles.push(article);
        });
        return _.first(mostReadArticles,[5]);
    },
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    },
    query      : function () {
        return Router.current().params.searchQuery;
    }
});
