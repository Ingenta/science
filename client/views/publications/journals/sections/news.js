Template.newContent.events({
    'click .activeButton': function (event) {
        Session.set('PerPage', undefined);
        var idValue = $(event.target).data().topicstid;
        Session.set('tabNews', idValue);
    }
});

Template.newsCenterList.onRendered(function () {
    if (Session.get('tabNews')===undefined) {
        Session.set('PerPage', undefined);
        Session.set('tabNews', "a1");
    }
});

Template.newsCenterList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            News.remove({_id:id});
        })
    },
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

Template.pubDynamicList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            News.remove({_id:id});
        })
    },
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

Template.meetingInfoList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            Meeting.remove({_id:id});
        })
    },
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

Template.newsCenterList.helpers({
    newsContent: function () {
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return myNewsPagination.find({about: aboutId,publications:publicationId,types:"2"},{itemsPerPage: numPerPage, sort: {releaseTime: -1}});
    },
    whichUrl: function() {
        var journalId = Session.get('currentJournalId');
        var publication = Publications.findOne({_id:journalId});
        if(this.url){
            return this.url;
        }
        return publication.shortTitle+"/news/journalNews/"+this._id;
    },
    newsContentCount: function(){
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return News.find({about: aboutId,publications:publicationId,types:"2"}).count()>10;
    }
});

Template.pubDynamicList.helpers({
    pubDynamic: function () {
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return myNewsPagination.find({about: aboutId,publications:publicationId,types:"2"},{itemsPerPage: numPerPage, sort: {releaseTime: -1}});
    },
    whichUrl: function() {
        var journalId = Session.get('currentJournalId');
        var publication = Publications.findOne({_id:journalId});
        if(this.url){
            return this.url;
        }
        return publication.shortTitle+"/news/journalNews/"+this._id;
    },
    pubDynamicCount: function(){
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return News.find({about: aboutId,publications:publicationId,types:"2"}).count()>10;
    }
});

Template.meetingInfoList.helpers({
    meetingContent: function () {
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return meetingPagination.find({about: aboutId,publications:publicationId},{itemsPerPage: numPerPage, sort: {startDate: -1}});
    },
    meetingCount: function(){
        var aboutId = Session.get('tabNews');
        var publicationId = Session.get('currentJournalId');
        return Meeting.find({about: aboutId,publications:publicationId}).count()>10;
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
        if(this.address && (this.address.en||this.address.cn)){
            return true;
        }
        return false;
    },
    Theme: function () {
        if(this.theme && (this.theme.en||this.theme.cn)){
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