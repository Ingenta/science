Template.AdminInstitutionsList.helpers({
	institutions:function(){
		//var pubId = Session.get('filterPublisher');
		//var first = Session.get('firstLetter');
		var numPerPage = Session.get('PerPage');
		if(numPerPage === undefined){
			numPerPage = 10;
		}
		var q = {};
		//pubId && (q.publisherId = pubId);
		//first && (q.title = {$regex: "^" + first, $options: "i"});
		return institutionPaginator.find(q,{itemsPerPage:numPerPage});
	}
});

Template.updateInstitutionForm.helpers({
	getTitle: function () {
		return TAPi18n.__("Update");
	}
})

Template.oneInstitution.events({
	"click a.fa-trash":function(e){
		e.preventDefault();
		var institutionId = this._id;
		sweetAlert({
			title             : TAPi18n.__("Warning"),
			text              : TAPi18n.__("Confirm_delete"),
			type              : "warning",
			showCancelButton  : true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText : TAPi18n.__("Do_it"),
			cancelButtonText  : TAPi18n.__("Cancel"),
			closeOnConfirm    : false
		}, function () {
			Institutions.remove({_id: institutionId});
			sweetAlert({
				title:TAPi18n.__("Deleted"),
				text:TAPi18n.__("Operation_success"),
				type:"success",
				timer:2000
			});
		});
	}
})

AutoForm.addHooks(['updateInstitutionModalForm'], {
	before: {
		update: function (doc) {
			_.each(doc.$set.ipRange, function (obj) {
				if (obj.startIP) {
					obj.startNum = Science.ipToNumber(obj.startIP);
				}
				if (obj.endIP) {
					obj.endNum = Science.ipToNumber(obj.endIP);
				}
			});
			return doc;
		}
	}
}, true);