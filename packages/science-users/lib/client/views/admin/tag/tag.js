Template.tagList.helpers({
    tags: function () {
        return Tags.find();
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