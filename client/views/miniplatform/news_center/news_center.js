Template.newsCenter.helpers({
    miniNews: function () {
        return NewsCenter.find({types:"1"},{sort: {createDate: -1}});
    },
    miniMagazines: function () {
        return NewsCenter.find({types:"2"},{sort: {createDate: -1}});
    },
    miniPublishing: function () {
        return NewsCenter.find({types:"3"},{sort: {createDate: -1}});
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/newsCenter/" + this._id;
    }
});

Template.newsCenter.events({
    'click #newsDel': function (e) {
        var nid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:nid});
        })
    },
    'click #magDel': function (e) {
        var mid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:mid});
        })
    },
    'click #pubDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:pid});
        })
    }
});

AutoForm.addHooks(['addMiniNewsModalForm'], {
    onSuccess: function () {
        $("#addMiniNewsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addMiniMagazineModalForm'], {
    onSuccess: function () {
        $("#addMiniMagazineModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "2";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addMiniPublishingModalForm'], {
    onSuccess: function () {
        $("#addMiniPublishingModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "3";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);