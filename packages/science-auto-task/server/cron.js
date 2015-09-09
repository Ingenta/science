SyncedCron.add({
	name:'DOI Register(注册DOI)',
	schedule: function(parser){
		return parser.text(Config.AutoTasks.DOI_Register.rate || "at 1:00am every day");
	},
	job: function(){
		Science.Interface.CrossRef.register({
			recvEmail:Config.AutoTasks.DOI_Register.recvEmail,
			rootUrl:Config.AutoTasks.DOI_Register.rootUrl,
			condition:Config.AutoTasks.DOI_Register.condition
		});
	}
});

//SyncedCron.add({
//	name:"Get Citations",
//	schedule:function(parser){
//		return parser.text("every 10 sec");
//	},
//	job:function(){
//		var jobs = Articles.find({doi:{$exists:true}},{fields:{doi:1}}).fetch();
//
//	}
//})

Meteor.startup(function(){
	if(Config.AutoTasks.start)
		SyncedCron.start();
})