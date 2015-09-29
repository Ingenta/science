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
				a[key] = Science.JSON.MergeObject(a[key], b[key]);
			}
		}
	}
	return a;
};
/**
 * 不重复的数组
 * @param equelFunc 判断是否重复的表达式 可选
 * @constructor
 */
Science.JSON.UniqueArray=function(equelFunc){
	var arr=[];
	var index=0;
	var func = equelFunc || _.isEqual;
	this.push = function(obj){
		var existObj = _.find(arr,function(insideObj){
			return func(_.omit(insideObj,"_index"),obj);
		});
		if(existObj){
			return existObj._index;
		}else{
			var cloneObj= _.clone(obj);
			cloneObj._index=index++;
			arr.push(cloneObj);
			return cloneObj._index;
		}
	};
	this.getArray=function(clearIndex){
		if(clearIndex){
			return _.map(arr, function(obj){ return _.omit(obj,"_index")});
		}
		return arr;
	};
};