Science.XPath = xpath;

//may be problem
Science.XPath.selectAsJson = function(xp,doc,callback){
	var nodes=Science.XPath.select(xp,doc);
	var text = nodes.toString();
	Science.JSON.parseString(text,function(err,result){
		if(!err)
			callback(result);
	})
};
/**
 * 静态工具类,用于解析xml
 */
Science.XPath.ParseHelper = {
	langNames:{
		cn: "zh-Hans",
		en: "en"
	},
	setLangArr:function(langArr) {
		this.langNames = langArr;
	},
	/**
	 * 同步方法
	 * 使用xpath从dom元素中获取节点集
	 * @param xp
	 * @param ele
	 * @returns
	 */
	getNodes:function(xp, ele){
		return Science.XPath.select(xp,ele);
	},
	/**
	 * 同步方法
	 * 使用xpath从dom元素中获取匹配的第一个节点
	 * @param xp
	 * @param ele
	 * @returns {*}
	 */
	getFirstNode:function(xp,ele){
		var nodes = this.getNodes(xp,ele);
		return nodes && nodes[0];
	},
	/**
	 * 同步方法
	 * 使用xpath从dom元素中获取单值
	 * @param xp
	 * @param ele
	 * @returns {void|*|string}
	 */
	getSimpleVal:function(xp,ele){
		var val = xpath.select(xp,ele);
		if(_.isEmpty(val) || _.isEmpty(val[0].childNodes))
			return;
		var datas = _.pluck(val[0].childNodes,"data");
		return datas.join("").trim();
	},
	/**
	 * 同步方法
	 * 使用xpath取得dom元素的内容
	 * @param xp
	 * @param ele
	 * @returns
	 */
	getXmlString:function(xp,ele){
		var val = xpath.select(xp,ele);
		if(_.isEmpty(val))
			return;
		return val[0].toString();
	},
	/**
	 * 同步方法
	 * 获取第一个匹配的dom元素的属性值
	 * @param xp
	 * @param ele
	 * @returns {void|*}
	 */
	getFirstAttribute:function(xp,ele){
		var attrs = this.getAttributes(xp,ele);
		return attrs && attrs[0];
	},
	/**
	 * 同步方法
	 * 获取全部匹配的dom元素的属性值
	 * @param xp
	 * @param ele
	 * @returns {void|*}
	 */
	getAttributes:function(xp,ele){
		var attrNodes = xpath.select(xp,ele);
		return !_.isEmpty(attrNodes) && _.pluck(attrNodes,"value");
	},
	/**
	 * 获取双语字段值
	 * @param xp
	 * @param ele
	 * @param [options] {[planb] [, handler]} planb是一个正常的xpath语句,handler是用于处理node的方法,
	 */
	getMultiVal:function(xp,ele,options){
		var obj = {};
		var failedLang=[];
		var successLang;
		var handler = (options && options.handler) || this.handler.simple;
		if(!_.isFunction(handler)){
			console.error("handler is not a function, but you shouldn't see this message");
		}
		_.each(this.langNames,function(val,key){
			obj[key]=handler(xp.replace('{lang}',val),ele);
			if(!obj[key])
				failedLang.push(key);
			else if(!successLang)
				successLang=key;
		});
		//若某语种未取到值,检查此字段是否有成功取到值的字段,如果有则用该语种内容填补未取到值的语种.
		if(!_.isEmpty(failedLang) && !_.isEmpty(this.langNames) && successLang){
			_.each(failedLang,function(key){
				obj[key]=obj[successLang];
			})
		}else if(!successLang && options && options.planb) {
			//若两种语言均不能取到值并且存在Plan B .... ,再用planb试试.. , planb应当是一个正常的xpath表达式
			var content = handler(options.planb, ele);
			if(content){
				_.each(this.langNames,function(val,key){
					obj[key]=content;
				})
			}
		}
		return obj;
	}
}

_.extend(Science.XPath.ParseHelper,{
	/**
	 * 可选的handler
	 */
	handler:{
		simple:Science.XPath.ParseHelper.getSimpleVal,
		xml:Science.XPath.ParseHelper.getXmlString,
		attribute:Science.XPath.ParseHelper.getFirstAttribute
	}
})