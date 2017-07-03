Template.sidebarAd.helpers({
    whichLink: function () {
        if (this.endDate.format("yyyy-MM-dd") >= new Date().format("yyyy-MM-dd")) return this.link;
        return this.defaultLink;
    },
    whichPictures: function () {
        if (this.endDate.format("yyyy-MM-dd") >= new Date().format("yyyy-MM-dd")) return this.pictures;
        return this.defaultPictures;
    },
    advertisement: function () {
        //判断当前路径是不是期刊或者期刊下属的页面
        var isJournalPage = _.contains(Config.Routes.ADPages.journal, Router.current().route.getName());
        var type = isJournalPage ? "2" : "1";
        var query = {types: type};
        if (isJournalPage) {
            query.publications = Session.get('currentJournalId');
        }
        return Advertisement.find(query);
    },
    isADPage: function () {
        if (!Router.current().route)return false;
        return _.contains(Config.Routes.ADPages.global, Router.current().route.getName())
            || _.contains(Config.Routes.ADPages.journal, Router.current().route.getName());
    },
    AdCount: function () {
        if (!Router.current().route)return 0;
        var isJournalPage = _.contains(Config.Routes.ADPages.journal, Router.current().route.getName());
        var type = isJournalPage ? "2" : "1";
        var query = {types: type};
        if (isJournalPage) {
            query.publications = Session.get('currentJournalId');
        }
        if (49 < Advertisement.find(query).count()) {
            return false;
        }
        return true;
    },
    permissionCheck: function (permissions) {
        permissions = permissions.split(',');
        if(_.contains(Config.Routes.ADPages.journal, Router.current().route.getName())){
            //journal page
            var onePermission = _.intersection(permissions, ["add-journal-advertisement", "modify-journal-advertisement", "delete-journal-advertisement"])[0];
            return Permissions.userCan(onePermission, 'advertisement', Meteor.userId(), {journal: Session.get('currentJournalId')});
        } else {
            //homepage
            var onePermission = _.intersection(permissions, ["add-homepage-advertisement", "modify-homepage-advertisement", "delete-homepage-advertisement"])[0];
            return Permissions.userCan(onePermission, 'advertisement');
        }
    }
});

Template.sidebarAd.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            Advertisement.remove({_id: id});
        })
    }
});

AutoForm.addHooks(['addAdvertisementModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        if(Router.current().params.journalShortTitle){
            Meteor.subscribe('journalPromoteImage',Router.current().params.journalShortTitle);
        }else{
            Meteor.subscribe('homePromoteImage');
        }
    },
    before: {
        insert: function (doc) {
            var isJournalPage = _.contains(Config.Routes.ADPages.journal, Router.current().route.getName());
            var type = isJournalPage ? 2 : 1;
            doc.types = type;
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);