Template.tagList.helpers({
    tags: function () {
        var tagNum = Session.get('TagNumber');
        if(tagNum===undefined||tagNum==""){
            return Tags.find();
        }
        return Tags.find({tagNumber:tagNum});
    }
});

Template.tagList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            Tags.remove({_id:id});
        })
    }
});

Template.AdminTag.events({
    'click .btn': function () {
        var query = $('#searchTagNumber').val();
        Session.set('TagNumber', query);
    }
});

AutoForm.addHooks(['addTagModalForm'], {
    onSuccess: function () {
        $("#addTagModal").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);