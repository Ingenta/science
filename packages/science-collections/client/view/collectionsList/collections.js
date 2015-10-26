Template.collections.helpers({
	isCollection: function() {
		return Router.current().route.getName() == "collections";
	},
	permissionCheck: function () {
		if(!Meteor.user()) return false;
		if(Permissions.isAdmin()) return true;
		if(Router.current().route.getName() === "collections") return false;
		if(!Meteor.user().publisherId) return false;
		if (Meteor.user().publisherId !== Session.get('currentPublisherId')) return false;
		if(Router.current().route.getName() === "publisher.name"){
			if (Permissions.userCan("publisher-collection", "publisher")) return true;
		}
		if(Router.current().route.getName() === "journal.name"){
			if (Permissions.userCan("journal-collection", "publisher")) return true;
			if (!Meteor.user().journalId) return false;
			if (!_.contains(Meteor.user().journalId, Session.get('currentJournalId'))) return false;
			if (Permissions.userCan("journal-collection", "resource")) return true;
		}
		return false;
	}
});

Template.addCollectionForm.helpers({
	getpublishers:function(){
		var iscn=TAPi18n.getLanguage()==='zh-CN';
		var pubs = Publishers.find({},{chinesename:1,name:1}).fetch();
		var result = [];
		_.each(pubs,function(item){
			var name = iscn?item.chinesename:item.name;
			result.push({label:name,value:item._id});
		});
		return result;
	},
	isCollection: function() {
		return Router.current().route.getName() == "collections";
	}
});


AutoForm.addHooks(['addCollectionModalForm'], {
	onSuccess: function () {
		$("#addCollectionModal").modal('hide');
		FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
	},
    before: {
        insert: function (doc) {
            doc.journalId = Session.get('currentJournalId');
            var a = Publications.findOne({"_id" : Session.get('currentJournalId')});
            if(a) doc.publisherId = a.publisher;
			var pid = Session.get('currentPublisherId');
			if(!doc.publisherId && pid) doc.publisherId = pid;
            return doc;
        }
    }
}, true);
