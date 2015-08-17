userProfileSchema  = new SimpleSchema({
	realname  : {
		type  : String,
		optional: true
	},
	institution: {
		type  : String,
		optional: true
	},
	fieldOfResearch:{
		type: String,
		optional: true
	},
	interestedOfJournals:{
		type: [String],
		optional: true,
		autoform:{
			type: "universe-select",
			afFieldInput: {
				multiple: true
			}
		}
	},
	interestedOfTopics:{
		type: [String],
		optional: true,
		autoform:{
			type: "universe-select",
			afFieldInput: {
				multiple: true
			}
		}
	},
	phone:{
		type: String,
		optional: true
	},
	address:{
		type: String,
		optional: true
	},
	weChat:{
		type: String,
		optional: true
	}
});