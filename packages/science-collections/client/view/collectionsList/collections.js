Template.collections.helpers({
	isCollection: function() {
		return Router.current().route.getName() == "collections";
	},
	permissionCheck: function (permissions) {
		if(!Meteor.user()) return false;
		if(Permissions.isAdmin()) return true;
		//var onePermission = _.intersection(permissions, ["add-big-collections", "modify-big-collections", "delete-big-collections"])[0];
		//if(Permissions.userCan(onePermission, 'collections')) return true;
		if(Router.current().route.getName() == "collections") return false;

		permissions = permissions.split(',');
		if(!Meteor.user().publisherId) return false;
		if (Meteor.user().publisherId !== Session.get('currentPublisherId')) return false;

		if(Router.current().route.getName() == "publisher.name"){
			onePermission = _.intersection(permissions, ["add-publisher-collection", "modify-publisher-collection", "delete-publisher-collection"])[0];
			return (Permissions.userCan(onePermission, 'collections'));
		}

		if(Router.current().route.getName() != "journal.name") return false;

		if (!_.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user")){
			if (!_.contains(Meteor.user().journalId, Session.get('currentJournalId'))) return false;
		}
		onePermission = _.intersection(permissions, ["add-journal-collection", "modify-journal-collection", "delete-journal-collection"])[0];
		return Permissions.userCan(onePermission, 'collections');
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
