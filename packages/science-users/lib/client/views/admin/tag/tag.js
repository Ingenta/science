Template.tagList.helpers({
    tags: function () {
        var tagNum = Session.get('TagNumber');
        if(tagNum===undefined||tagNum==""){
            return Tags.find();
        }
        return Tags.find({tagNumber:tagNum});
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