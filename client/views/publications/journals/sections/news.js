Template.newContent.events({
    'click .activeButton': function (event) {
        var idValue = $(event.target).data().topicstid;
        Session.set('tabNews', idValue);
    }
});

Template.newsCenterList.onRendered(function () {
    if (Session.get('tabNews')===undefined) {
        Session.set('tabNews', "a1");
    }
});

Template.newsCenterList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            News.remove({_id:id});
        })
    }
});

Template.pubDynamicList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            News.remove({_id:id});
        })
    }
});

Template.meetingInfoList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            Meeting.remove({_id:id});
        })
    }
});

Template.newsCenterList.helpers({
    newsContent: function () {
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return News.find({about: aboutId,publications:publicationId,types:"2"});
    },
    whichUrl: function() {
        if(this.url){
            return this.url;
        }
        return "/news/"+this._id;
    }
});

Template.pubDynamicList.helpers({
    pubDynamic: function () {
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return News.find({about: aboutId,publications:publicationId,types:"2"});
    }
});

Template.meetingInfoList.helpers({
    meetingContent: function () {
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return Meeting.find({about: aboutId,publications:publicationId});
    },
    StartDate: function () {
        if(this.startDate){
            return true;
        }
        return false;
    },
    Phone: function () {
        if(this.phone){
            return true;
        }
        return false;
    },
    Address: function () {
        if(this.address.en||this.address.cn){
            return true;
        }
        return false;
    },
    Theme: function () {
        if(this.theme.en||this.theme.cn){
            return true;
        }
        return false;
    }
});

AutoForm.addHooks(['addNewsCenterModalForm'], {
    onSuccess: function () {
        $("#addNewsCenterModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            var newPage=_.contains(Config.Routes.NewsPage.journal,Router.current().route.getName());
            var type =newPage?2:1;
            doc.types = type;
            doc.createDate = new Date();
            doc.about = Session.get('tabNews');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addPublishingDynamicForm'], {
    onSuccess: function () {
        $("#addPublishingDynamicModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            var newPage=_.contains(Config.Routes.NewsPage.journal,Router.current().route.getName());
            var type =newPage?2:1;
            doc.types = type;
            doc.createDate = new Date();
            doc.about = Session.get('tabNews');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addMeetingInfoModal'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabNews');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);