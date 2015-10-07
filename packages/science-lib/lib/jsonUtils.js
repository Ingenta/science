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
Science.JSON.UniqueArray=function(id, equelFunc){
	var id = id || "_index";
	var arr=[];
	var index=0;
	var func = equelFunc || _.isEqual;
	this.push = function(obj){
		var existObj = this.exists(obj);
		if(existObj){
			return existObj[id];
		}else{
			var cloneObj= _.clone(obj);
			cloneObj[id]=index++;
			arr.push(cloneObj);
			return cloneObj[id];
		}
	};
	this.getArray=function(clearIndex){
		if(clearIndex){
			return _.map(arr, function(obj){ return _.omit(obj,id)});
		}
		return arr;
	};
	this.exists = function(obj){
		return _.find(arr,function(insideObj){
			return func(_.omit(insideObj,id),obj);
		});
	}
};
/**
 * 不重复数组的另一种实现方式
 * @param keyGenerator
 * @constructor
 */
Science.JSON.UniqueList = function(keyGenerator){
	if(!keyGenerator || !_.isFunction(keyGenerator)){
		throw new Error("generator is wrong! it's should be a function");
	}
	var _list = {};
	this.push = function(obj){
		var key = keyGenerator(obj);
		_list[key]=obj;
	};
	this.exists = function(obj){
		var key = keyGenerator(obj);
		return _list.hasOwnProperty(key);
	};
};