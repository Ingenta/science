Template.memorabilia.helpers({
    hide: function () {
        return NewsContact.find({types:"4"}).count()<1 ? "": "hide";
    }
});

Template.memorabiliaList.helpers({
    memorabilias: function () {
        return NewsContact.find({types:"4"});
    },
    accordionExists:function(){
        return !_.isEmpty(this.accordion);
    },
    historyNewsExists: function () {
        var history = NewsContact.find({types:"8"});
        if(history.count()>0)return true;
    },
    historyList: function () {
        return NewsContact.find({types:"8"},{sort: {title: 1}});
    }
});

Template.memorabiliaList.events({
    'click #memDel': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addMemorabiliaModalForm'], {
    onSuccess: function () {
        $("#addMemorabiliaModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "4";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addHistoryNewsModalForm'], {
    onSuccess: function () {
        $("#addHistoryNewsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "8";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);