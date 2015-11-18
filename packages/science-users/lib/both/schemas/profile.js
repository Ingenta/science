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
	journalsOfInterest:{
		type: [String],
		optional: true,
		autoform:{
			type: "universe-select",
			afFieldInput: {
				multiple: true,
				create: false
			}
		}
	},
	topicsOfInterest:{
		type: [String],
		optional: true,
		autoform:{
			type: "universe-select",
			afFieldInput: {
				multiple: true,
				create: false
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
	},
	hidden:{
		type: String,
		optional: true,
		autoform:{
			afFieldInput:{
				type: "hidden"
			}
		}
	}
});