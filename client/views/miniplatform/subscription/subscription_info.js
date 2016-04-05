Template.subscription.helpers({
    hide: function () {
       return NewsContact.find({types:"5"}).count()<1 ? "": "hide";
    }
});

Template.subscriptionList.helpers({
    subscriptions: function () {
        return NewsContact.find({types:"5"});
    },
    wordValue:function(){
        if(this.fileId===undefined){
            return null;
        }
        var file = Collections.JournalMediaFileStore.findOne({_id:this.fileId});
        return file.url({auth:false})+"&download=true";
    }
});

Template.subscriptionList.events({
    'click #subDel': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addSubscriptionModalForm'], {
    onSuccess: function () {
        $("#addSubscriptionModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "5";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);