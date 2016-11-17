ReactiveTabs.createInterface({
    template: 'newCenterTabs',
    onChange:function(slug){
        history.replaceState({},document.title,window.location.pathname + "?slug="+slug);
    }
});

Template.newsCenter.helpers({
    recruitInfo: function () {
        return NewsCenter.find({types:"4"},{limit:1});
    },
    hide: function () {
        return NewsCenter.find({types:"4"}).count()<1 ? "": "hide";
    },
    miniMagazines: function () {
        var numPerPage = Session.get('PerPage') || 10;
        return magazinesPaginator.find({types:"2"},{itemsPerPage: numPerPage, sort: {releaseTime: -1}});
    },
    magazinesCount: function () {
        return NewsCenter.find({types:"2"}).count()>10;
    },
    miniPublishing: function () {
        var numPerPage = Session.get('PerPage') || 10;
        return publishingPaginator.find({types:"3"},{itemsPerPage: numPerPage, sort: {releaseTime: -1}});
    },
    publishingCount: function () {
        return NewsCenter.find({types:"3"}).count()>10;
    },
    whichUrl: function () {
        if (this.link)return this.link;
        return "/miniplatform/newsCenter/" + this._id;
    },
    tabs: function () {
        return [
            {name: TAPi18n.__("Magazine dynamic"), slug: 'scpNews'},
            {name: TAPi18n.__("Publishing Dynamic"), slug: 'publishingNews'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});

Template.newsCenter.events({
    'click #recruitDel': function (e) {
        var nid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:nid});
        })
    },
    'click #magDel': function (e) {
        var mid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:mid});
        })
    },
    'click #pubDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:pid});
        })
    }
});

AutoForm.addHooks(['addMiniMagazineModalForm'], {
    onSuccess: function () {
        $("#addMiniMagazineModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            // Allow upload files under 1MB
            var image = Images.findOne({_id:doc.picture});
            if(image){
                if (image.original.size <= 1048576) {
                    doc.types = "2";
                    doc.createDate = new Date();
                    return doc;
                }else{
                    $("#addMiniMagazineModal").modal('hide');
                    FlashMessages.sendError(TAPi18n.__("Upload Images Error"), {hideDelay: 30000});
                }
            }else{
                doc.types = "2";
                doc.createDate = new Date();
                return doc;
            }
        }
    }
}, true);

AutoForm.addHooks(['addMiniPublishingModalForm'], {
    onSuccess: function () {
        $("#addMiniPublishingModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            // Allow upload files under 1MB
            var image = Images.findOne({_id:doc.picture});
            if(image){
                if (image.original.size <= 1048576) {
                    doc.types = "3";
                    doc.createDate = new Date();
                    return doc;
                }else{
                    $("#addMiniPublishingModal").modal('hide');
                    FlashMessages.sendError(TAPi18n.__("Upload Images Error"), {hideDelay: 30000});
                }
            }else{
                doc.types = "3";
                doc.createDate = new Date();
                return doc;
            }
        }
    }
}, true);

AutoForm.addHooks(['addRecruitmentModalForm'], {
    onSuccess: function () {
        $("#addRecruitmentModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "4";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);