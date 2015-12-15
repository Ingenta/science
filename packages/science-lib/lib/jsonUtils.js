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
Science.JSON.UniqueArray=function(id, equelFunc, start){
	var id = id || "_index";
	var arr=[];
	var index=start || 0;
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
	};
	this.count = function(){
		return arr.length;
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

Science.JSON.try2GetRightLangVal=function(obj,fieldArr,lang){
	if(_.isEmpty(obj) || _.isString(obj))
		return obj;
	var langArr = fieldArr || ["cn","en"];
	//当前语言设置优先级 参数lang > TAPi18n > 默认值zh-CN
	var currLang = lang || (TAPi18n && TAPi18n.getLanguage()) || "zh-CN";
	var index = currLang=='zh-CN'?0:1;
	//若没有当前语种的内容，则使用另一种语种内容
	var content= obj[langArr[index]] || obj[langArr[1-index]];
	return content;
}
/**
 * 合并数组中的多个对象 ,如
 * [{a:[1,2],b:[1]},{a:[2,3],c:[1]}]
 * 合并后
 * {a:[1,2,3],b:[1],c:[1]}
 * @returns
 */
Science.JSON.mergeRanges=function(){
	return _.reduce(arguments,function(memo,obj){
		_.each(obj,function(val,key) {
			val = _.isArray(val)?val:(val?[val]:[]);
			if (!_.isEmpty(val))
				memo[key] = memo[key] ? _.union(val, memo[key]) : val;
		})
		return memo;
	},{})
}