var rawColl=Logs.rawCollection();

Science.Statistic.group = function () {
	var args = _.toArray(arguments);
	return Meteor.wrapAsync(function () {
		rawColl.group.apply(rawColl, args);
	})();
};

/*
Meteor.startup(function () {
	Science.Statistic.group(
		//key
		{title: true, user: true},
		//condition
		{year: 2013},
		//initial
		{read: 0, recommend: 0, fav: 0, download: 0},
		//reduce
		function (doc, result) {
			result[doc.active]++;
		},
		//callback
		function(err,result){
			console.dir(result);
		}
	)
});
*/
