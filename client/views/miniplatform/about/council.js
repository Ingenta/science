Template.council.helpers({
    hide: function () {
        return NewsContact.find({types:"3"}).count()<1 ? "": "hide";
    }
});

Template.councilList.helpers({
    councils: function () {
        return NewsContact.find({types:"3"});
    }
});

Template.councilList.events({
    'click #couDel': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addCouncilModalForm'], {
    onSuccess: function () {
        $("#addCouncilModal").modal('hide');
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