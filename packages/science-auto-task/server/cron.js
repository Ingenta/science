SyncedCron.add({
	name:'DOI Register(注册DOI)',
	schedule: function(parser){
		return parser.text(Config.AutoTasks.DOI_Register.rate);
	},
	job: function(){
		var condition=Config.AutoTasks.DOI_Register.condition || 1;
		condition = new Date().addDays(0-condition);
		var regjobs = Articles.find({$or:[
			{"stamps.rdoi":{$exists:false}}, //从未进行过注册的
			{"stamps.rdoi":{$lte:condition}} //较早前进行过注册的
		]},{fields:{journalId:1,doi:1,title:1,year:1}}).fetch();

		Science.Interface.CrossRef.register(regjobs,Config.AutoTasks.DOI_Register.recvEmail,Config.AutoTasks.DOI_Register.rootUrl);
		return regjobs.length;
	}
});

Meteor.startup(function(){
	if(Config.AutoTasks.start)
		SyncedCron.start();
})