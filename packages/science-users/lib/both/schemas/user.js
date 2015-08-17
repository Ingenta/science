userSchema = new SimpleSchema({
	username:{
		type:String
	},
	profile:{
		type:userProfileSchema
	}
})