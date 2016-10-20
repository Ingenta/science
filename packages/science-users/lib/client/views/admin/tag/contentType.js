Template.contentTypeList.helpers({
    contentType: function () {
        var numPerPage = Session.get('PerPage') || 10;
        if(Session.get('searchColumn')){
            var tagName = Session.get('searchColumn');
            var mongoDbArr = [];
            mongoDbArr.push({'subject': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.en': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.cn': {$regex: tagName, $options: "i"}});
            return contentTypePagination.find({$or: mongoDbArr}, {itemsPerPage: numPerPage, sort: {subject: 1}});
        }else{
            return contentTypePagination.find({}, {itemsPerPage: numPerPage, sort: {subject: 1}});
        }
    },
    contentTypeCount: function () {
        if(Session.get('searchColumn')){
            var tagName = Session.get('searchColumn');
            var mongoDbArr = [];
            mongoDbArr.push({'subject': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.en': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name.cn': {$regex: tagName, $options: "i"}});
            return ContentType.find({$or: mongoDbArr}).count()>10;
        }else{
            return ContentType.find().count()>10;
        }
    }
});

Template.contentTypeList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            ContentType.remove({_id:id});
        })
    }
});

Template.searchContentType.events({
    'click .btn': function () {
        var query = $('#searchColumn').val();
        Session.set('searchColumn', query);
    }
});

AutoForm.addHooks(['addContentTypeModalForm'], {
    onSuccess: function () {
        $("#addContentTypeModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);