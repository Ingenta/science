SyncedCron.add({
	name:'test my cron',
	schedule: function(parser){
		return parser.text('every 2 sec');
	},
	job: function(){
		var numbersCrunched = 121212;
		console.log(numbersCrunched);
		return numbersCrunched;
	}
});

Meteor.startup(function(){
	SyncedCron.start();
})