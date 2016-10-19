Template.tagList.helpers({
    tags: function () {
        var numPerPage = Session.get('PerPage') || 10;
        if(Session.get('searchValue')){
            var tagName = Session.get('searchValue');
            var mongoDbArr = [];
            mongoDbArr.push({'tagNumber': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.en': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.cn': {$regex: tagName, $options: "i"}});
            return tagsPagination.find({$or: mongoDbArr}, {itemsPerPage: numPerPage, sort: {createDate: -1}});
        }else{
            return tagsPagination.find({}, {itemsPerPage: numPerPage, sort: {createDate: -1}});
        }
    },
    tagsCount: function () {
        if(Session.get('searchValue')){
            var tagName = Session.get('searchValue');
            var mongoDbArr = [];
            mongoDbArr.push({'tagNumber': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.en': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.cn': {$regex: tagName, $options: "i"}});
            return Tags.find({$or: mongoDbArr}).count()>10;
        }else{
            return Tags.find().count()>10;
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
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);