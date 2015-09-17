Science.JSON = {};

if(Meteor.isServer){
	Science.JSON = Npm.require('xml2js');
}

Science.JSON.MergeObject=function(a, b){
	if (a && b) {
		for (var key in b) {
			if (typeof a[key] == 'undefined') {
				a[key] = b[key];
			} else if (typeof a[key] == 'object' && typeof b[key] == 'object') {
				a[key] = merge(a[key], b[key]);
			}
		}
	}
	return a;
}