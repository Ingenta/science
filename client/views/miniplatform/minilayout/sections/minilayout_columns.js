Template.layoutColumns.helpers({
    firstColumn: function () {
        return Column.find({types:"1"},{limit: 1});
    },
    secondColumn: function () {
        return Column.find({types:"2"},{limit: 1});
    },
    thirdColumn: function () {
        return Column.find({types:"3"},{limit: 1});
    },
    ColumnUrl: function () {
        return "/miniplatform/" + this._id;
    },
    firstHide: function () {
        return Column.find({types:"1"}).count()<1 ? "": "hide";
    },
    secondHide: function () {
        return Column.find({types:"2"}).count()<1 ? "": "hide";
    },
    thirdHide: function () {
        return Column.find({types:"3"}).count()<1 ? "": "hide";
    }

});

Template.layoutColumns.events({
    'click #meetingDel': function (e) {
        var nid = this._id;
        confirmDelete(e,function(){
            Column.remove({_id:nid});
        })
    },
    'click #fundDel': function (e) {
        var mid = this._id;
        confirmDelete(e,function(){
            Column.remove({_id:mid});
        })
    },
    'click #forumDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            Column.remove({_id:pid});
        })
    }
});

AutoForm.addHooks(['addXianMeetingModalForm'], {
    onSuccess: function () {
        $("#addXianMeetingModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        Meteor.subscribe('columnImage');
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addFundsModalForm'], {
    onSuccess: function () {
        $("#addFundsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        Meteor.subscribe('columnImage');
    },
    before: {
        insert: function (doc) {
            doc.types = "2";
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addForumColumnModalForm'], {
    onSuccess: function () {
        $("#addForumColumnModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        Meteor.subscribe('columnImage');
    },
    before: {
        insert: function (doc) {
            doc.types = "3";
            return doc;
        }
    }
}, true);