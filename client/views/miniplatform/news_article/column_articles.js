Template.columnViewsDetails.helpers({
    columnTitle: function () {
        var columnId = Router.current().params.columnId;
        var columns = Column.findOne({_id: columnId});
        if(columns===undefined)return "新闻专栏" ;
        return columns.title;
    },
    columnList: function () {
        var columnId = Router.current().params.columnId;
        return ColumnViews.find({columnId: columnId});
    }
});

AutoForm.addHooks(['addColumnViewsModalForm'], {
    onSuccess: function () {
        $("#addColumnViewsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.columnId = Router.current().params.columnId;
            doc.usersId = Meteor.userId();
            return doc;
        }
    }
}, true);
