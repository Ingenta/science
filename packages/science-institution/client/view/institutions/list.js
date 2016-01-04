Template.AdminInstitutionsList.onRendered(function(){
    Session.set('activeTab', 'detail');
});

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
});

Template.oneInstitution.events({
	"click a.fa-trash":function(e){
		e.preventDefault();
		var institutionId = this._id;
		confirmDelete(e,function(){
			Institutions.remove({_id: institutionId});
		});
	}
});

Template.availabilityModle.helpers({
	isAvaiable: function (available) {
		return this.available === available;
	}
});

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

Template.availabilityModle.events({
	'click .fa-eye': function (event) {
		Institutions.update({_id:this._id},{$set:{available:0}});
	},
	'click .fa-eye-slash': function (event) {
		Institutions.update({_id:this._id},{$set:{available:1}});
	}
});