Template.JournalTabInPublisher.helpers({
    publisher: function () {
        var publisherId = Session.get("currentPublisherId");
        if (publisherId)return Publishers.findOne({_id: publisherId});
        return Router.current().data();
    }
});

Template.PublicationList.helpers({
    publications: function () {
        var pubId = this._id;
        var first = Session.get('pubFirstLetter');
        var numPerPage = Session.get('PerPage') || 10;
        var q = {};
        if(!Permissions.userCan("modify-journal", "resource",this.userId))
            q.visible="1";
        pubId && (q.publisher = pubId);
        var reg;
        if (first && first == "other") {
            reg = "^[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex: reg, $options: "i"});
        Session.set("totalPublicationResults", Publications.find(q).count());
        if(TAPi18n.getLanguage() === "en")return journalPagination.find(q, {itemsPerPage: numPerPage, sort: {title: 1}});
        return journalPagination.find(q, {itemsPerPage: numPerPage, sort: {title: 1}});
    },
    publicationPageCount: function () {
        var pubId = this._id;
        var first = Session.get('pubFirstLetter');
        var q = {};
        if(!Permissions.userCan("modify-journal", "resource",this.userId))
            q.visible="1";
        pubId && (q.publisher = pubId);
        var reg;
        if (first && first == "other") {
            reg = "^[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex: reg, $options: "i"});
        return Publications.find(q).count()>10;
    }
});

Template.accessKeyImage.helpers({
    accessKeyIs: function (accessKey) {
        return this.accessKey === accessKey;
    }
});

Template.displayPublication.helpers({
    visibleIs: function (visible) {
        return this.visible === visible;
    }
});

Template.SinglePublication.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            Publications.update({_id: id}, {$set: {visible: 0}});
        })
    }
});

Template.SinglePublication.helpers({
    getModalTitle:function(){
        return TAPi18n.__("Update");
    },
    //hide: function(){
    //    Meteor.subscribe('publishersJournalsTab', this._id);
    //    return Articles.find({journalId:this._id}).count()<1 ? "": "hide";
    //}
});

Template.displayPerPage.onRendered(function(){
    Session.set('PerPage', undefined);
})

Template.displayPerPage.events({
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

Template.addPublicationForm.helpers({
    getTopics: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var topics = Topics.find({}, {name: 1, englishName: 1}).fetch();
        var result = [];
        _.each(topics, function (item) {
            var name = iscn ? item.name : item.englishName;
            result.push({label: name, value: item._id});
        });
        return result;
    },
    getTags: function () {
        var tags = Tags.find({}).fetch();
        var result = [];
        _.each(tags, function (item) {
            result.push({label: item.tagNumber, value: item._id});
        });
        return result;
    }
});

AutoForm.addHooks(['addPublicationModalForm'], {
    onSuccess: function () {
        $("#addPublicationModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            // Allow upload files under 1MB
            var image = Images.findOne({_id:doc.picture});
            if (image.original.size <= 1048576) {
                doc.createDate = new Date();
                doc.publisher = Session.get('currentPublisherId');
                if (doc.issn) doc.issn = doc.issn.trim().replace("-", "");
                return doc;
            }else{
                $("#addPublicationModal").modal('hide');
                FlashMessages.sendError(TAPi18n.__("Upload Images Error"), {hideDelay: 30000});
            }
        }
    }
}, true);

Template.displayPublication.events({
    'click .fa-eye': function (event) {
        Publications.update({_id: this._id}, {$set: {visible: 0}});
    },
    'click .fa-eye-slash': function (event) {
        Publications.update({_id: this._id}, {$set: {visible: 1}});
    }
});