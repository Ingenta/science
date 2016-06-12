ReactiveTabs.createInterface({
    template: 'enterCultureTabs',
    onChange:function(slug){
        history.replaceState({},document.title,window.location.pathname + "?slug="+slug);
    }
});

Template.enterpriseCulture.helpers({
    enterpriseNews: function () {
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        return newsContactPagination.find({types:"6"}, {itemsPerPage: numPerPage, sort: {releaseTime: -1}});
    },
    enterpriseNewsCount: function () {
        return NewsContact.find({types:"6"}).count()>10;
    },
    editFields: function () {
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        return newsContactPagination.find({types:"7"}, {itemsPerPage: numPerPage, sort: {releaseTime: -1}});
    },
    editFieldsCount: function () {
        return NewsContact.find({types:"7"}).count()>10;
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/enterpriseCulture/" + this._id;
    },
    tabs: function () {
        return [
            {name: TAPi18n.__("Corporate News"), slug: 'enterNews'},
            {name: TAPi18n.__("Edit Corner"), slug: 'editCorner'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});

Template.enterpriseCulture.events({
    'click #entersDel': function (e) {
        var mid = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:mid});
        })
    },
    'click #editsDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:pid});
        })
    },
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

AutoForm.addHooks(['addMiniEnterModalForm'], {
    onSuccess: function () {
        $("#addMiniEnterModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "6";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addMiniEditFieldModalForm'], {
    onSuccess: function () {
        $("#addMiniEditFieldModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "7";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);