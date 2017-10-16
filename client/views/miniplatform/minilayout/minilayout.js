Template.miniLayout.helpers({
    collectionsLink: function () {
        var publisher = Publishers.findOne({shortname: Config.defaultPublisherShortName});
        if(publisher){
            return "http://engine.scichina.com/publisher/" + publisher.shortname+"?slug=collections";
        }
    },
    myLinks: function () {
        return NewsLink.find({types:"1"});
    },
    hide: function () {
        return NewsLink.find({types:"1"}).count()<8 ? "": "hide";
    },
    menuClass:function(routeName){
        if (!Router.current() || !Router.current().route) {
            return "";
        }

        if (!Router.routes[routeName]) {
            return "";
        }

        var currentPath = Router.routes[Router.current().route.getName()].handler.path;
        var routePath = Router.routes[routeName].handler.path;
        if (routePath === "/") {
            return currentPath == routePath ? "curLi" : "";
        }
        return currentPath.indexOf(routePath) === 0 ? "curLi" : "";
    },
    currYear:function(){
        return new Date().getYear()+1900;
    }
});

Template.miniLayout.events({
    'click .btn': function () {
        var options = $('#searchSelect').val();
        var sword = $('#searchInput').val();
        if (sword) {
            if (options == "resource") {
                SolrQuery.search({query: sword, setting: {from: "bar"}});
            }
            if (options == "local") {
                Router.go('/miniplatform/newsSearchShowPage/' + sword);
            }
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var options = $('#searchSelect').val();
            var sword = $('#searchInput').val();
            if (sword) {
                if (options == "resource") {
                    SolrQuery.search({query: sword, setting: {from: "bar"}});
                }
                if (options == "local") {
                    Router.go('/miniplatform/newsSearchShowPage/' + sword);
                }
            }
        }
    },
    'click #myLink': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsLink.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addIndexNewsLinkModalForm'], {
    onSuccess: function () {
        $("#addIndexNewsLinkModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        Meteor.subscribe('newsBottomLinkImage');
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            return doc;
        }
    }
}, true);
