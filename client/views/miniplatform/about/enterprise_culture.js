Template.enterpriseCulture.helpers({
    enterpriseNews: function () {
        return NewsContact.find({types:"6"},{sort: {createDate: -1}});
    },
    editFields: function () {
        return NewsContact.find({types:"7"},{sort: {createDate: -1}});
    }
});

Template.enterpriseCulture.events({
    'click #entersDel': function (e) {
        var mid = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:mid});
        })
    },
    'click #editsDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:pid});
        })
    }
});

AutoForm.addHooks(['addMiniEnterModalForm'], {
    onSuccess: function () {
        $("#addMiniEnterModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "6";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addMiniEditFieldModalForm'], {
    onSuccess: function () {
        $("#addMiniEditFieldModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "7";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);