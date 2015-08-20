Template.collections.helpers({
	isCollection: function() {
		return Router.current().route.getName() == "collections";
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
		FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
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
