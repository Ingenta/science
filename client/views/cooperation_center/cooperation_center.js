Template.cooperationCenter.helpers({
    publishers: function(){
        return Publishers.find();
    },
    publicationAds: function(pId){
        return JournalAC.find({types: "1",publisher: pId});
    },
    titleValue: function (id) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publication = Publications.findOne({_id: id});
        if(publication)return iscn ? publication.titleCn : publication.title;
    },
    pdfValue:function(){
        var file = Collections.Files.findOne({_id:this.fileId});
        if(file)return file.url();
    }
});

Template.cooperationCenter.events({
    'click #adAdd': function (event) {
        var pubsId = $(event.target).data().pubsid;
        Session.set('PublisherId', pubsId);
    },
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            JournalAC.remove({_id:id});
        })
    }
});

Template.updateAdCenterModalForm.helpers({
    getJournals: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publications = Publications.find({publisher: this.publisher}).fetch();
        if(publications)
        var result = [];
        _.each(publications, function (item) {
            var name = iscn ? item.titleCn : item.title;
            result.push({label: name, value: item._id});
        });
        return result;
    }
});

Template.addAdCenterModalForm.helpers({
    getJournals: function () {
        var viewsId =  Session.get('PublisherId');
        if(viewsId)
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publications = Publications.find({publisher: viewsId}).fetch();
        if(publications)
        var result = [];
        _.each(publications, function (item) {
            var name = iscn ? item.titleCn : item.title;
            result.push({label: name, value: item._id});
        });
        return result;
    }
});

AutoForm.addHooks(['addAdCenterModalForm'], {
    onSuccess: function () {
        $("#addAdCenterModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            doc.publisher = Session.get('PublisherId');
            return doc;
        }
    }
}, true);