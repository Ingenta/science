Template.institutionDetail.helpers({
    info: function () {
		var obj = Institutions.findOne({_id: Router.current().params.insId});
		return obj;
	},
    getType: function(type){
        switch (type){
            case "1": return TAPi18n.__("Librarian");
            case "2": return TAPi18n.__("Publisher");
            case "3": return TAPi18n.__("Editorial Board");
            case "4": return TAPi18n.__("University");
            case "5": return TAPi18n.__("Institution");
            case "6": return TAPi18n.__("Others");
        }
    }
})