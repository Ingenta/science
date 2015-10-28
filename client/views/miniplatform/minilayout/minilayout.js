Template.miniLayout.helpers({
    myLinks: function () {
        return NewsLink.find({types:"1"});
    },
    hide: function () {
        return NewsLink.find({types:"1"}).count()<6 ? "": "hide";
    }
});

Template.miniLayout.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            SolrQuery.search({query:sword,setting:{from:"bar"}});
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                SolrQuery.search({query:sword,setting:{from:"bar"}});
            }
        }
    },
    'click .fa-trash': function (e) {
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
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            return doc;
        }
    }
}, true);
