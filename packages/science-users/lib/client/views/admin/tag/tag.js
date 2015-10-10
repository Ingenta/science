Template.tagList.helpers({
    tags: function () {
        var tagName = Session.get('searchValue').replace(/(^\s*)|(\s*$)/g,"");
        if(tagName===undefined||tagName==""){
            return Tags.find();
        }
        var fq = $('#searchId').val();
        if(fq=="tagNumber"){
            return Tags.find({tagNumber:tagName});
        }
        if(fq=="name"){
            return Tags.find({name:tagName});
        }
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

Template.searchTag.events({
    'click .btn': function () {
        var query = $('#searchValue').val();
        Session.set('searchValue', query);
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