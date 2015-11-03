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
    },
    isActive: function (id) {
        var viewsId =  Session.get('tabColumn');
        if(viewsId===undefined)return;
        if (viewsId === id)return "active";
    },
    columnViewsTitle: function () {
        var viewsId =  Session.get('tabColumn');
        if(viewsId){
            var views = ColumnViews.findOne({_id: viewsId});
            if(views)return views.title;
        }
    },
    columnViewsIntroduction: function () {
        var viewsId =  Session.get('tabColumn');
        if(viewsId){
          var views = ColumnViews.findOne({_id: viewsId});
          if(views)return views.abstract;
        }
    },
    columnViewsContent: function () {
        var viewsId =  Session.get('tabColumn');
        if(viewsId){
            var views = ColumnViews.findOne({_id: viewsId});
            if(views)return views.content;
        }
    },
    hide: function () {
        var columnId = Router.current().params.columnId;
        return ColumnViews.findOne({columnId: columnId}).count()>0 ? "": "hide";
    }
});

Template.columnViewsDetails.events({
    'click .activeBut': function (event) {
        var columnViewId = $(event.target).data().columnid;
        Session.set('tabColumn', columnViewId);
    },
    'click .columnDel': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            ColumnViews.remove({_id:id});
        })
    }
});

Template.columnViewsDetails.onRendered(function () {
    var columnId = Router.current().params.columnId;
    var a = ColumnViews.findOne({columnId: columnId},{limit: 1});
    if (a){
        Session.set('tabColumn', a._id);
    }else{
        Session.set('tabColumn', undefined);
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
