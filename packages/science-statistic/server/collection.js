Logs = new Mongo.Collection("Logs");

//Meteor.startup(function(){
//	if(Logs.find().count()==0){
//		var titles = ["linux私房菜","Java编程思想","数学之美","浪潮之巅","算法","疯狂Android讲义"];
//		var users =  ["jack","rose","rick","lily","lucy","ben"];
//		var actives = ["read","recommend","fav","download"];
//		for(var i=0;i<1000000;i++){
//			Logs.insert({
//				title:titles[Math.getRandom() % 6],
//				user:users[Math.getRandom() % 6],
//				year:2000+Math.getRandom()%14,
//				active:actives[Math.getRandom()%4],
//				month:Math.getRandom()%12+1
//			});
//		}
//	}
//});