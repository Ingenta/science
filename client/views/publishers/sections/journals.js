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
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        var q = {};
        pubId && (q.publisher = pubId);
        var reg;
        if (first && first == "other") {
            reg = "^[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex: reg, $options: "i"});
        Session.set("totalPublicationResults", Publications.find(q).count());
        return myPubPagination.find(q, {itemsPerPage: numPerPage});
    },
    publicationPageCount: function () {
        var pubId = this._id;
        var first = Session.get('pubFirstLetter');
        var q = {};
        pubId && (q.publisher = pubId);
        var reg;
        if (first && first == "other") {
            reg = "^[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex: reg, $options: "i"});
        return myPubPagination.find(q).count()>10;
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

Template.updatePublicationModalForm.helpers({
    getTitle: function () {
        return TAPi18n.__("Update");
    },
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
Template.SinglePublication.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            Publications.remove({_id: id});
        })
    }
});

Template.PublicationList.events({
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

Template.SinglePublication.helpers({
    getJournalUrl: function (title) {
        return Router.current().url + "/journal/" + title;
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
            doc.createDate = new Date();
            doc.publisher = Session.get('currentPublisherId');
            if (doc.issn) doc.issn = doc.issn.trim().replace("-", "");
            return doc;
        }
    }
}, true);

Template.displayPublication.events({
    'click .fa-eye': function (event) {
        //Publications.update({_id:this._id},{$set:{visible:2}});
        Publications.update({_id: this._id}, {$set: {visible: 0}});
    },
    'click .fa-eye-slash': function (event) {
        Publications.update({_id: this._id}, {$set: {visible: 1}});
    }
});