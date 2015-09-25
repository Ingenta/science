Parser = function(filepath,options,callback){

	var fs = Science.FSE;
	var xpath = Science.XPath;
	var dom;

	/**
	 * 同步方法
	 * 使用xpath从dom元素中获取单值
	 * @param xp
	 * @param ele
	 * @returns {void|*|string}
	 */
	var getSimpleVal=function(xp,ele){
		var val = xpath.select(xp,ele || dom);
		return val && val.toString().trim();
	};

	var getNodes=function(xp,ele){
		return xpath.select(xp,ele || dom);
	}
	/**
	 * 异步方法
	 * 解析DOM
	 * @param data
	 */
	var parse = function(data){
		dom = new Science.Dom().parseFromString(data);
		var issue = {};
		issue.issn=getSimpleVal("//issue/issn/text()");
		issue.journalName = getSimpleVal("//issue/journalname/text()");
		issue.title=getSimpleVal("//issue/title/text()");
		issue.year=getSimpleVal("//issue/year/text()");
		issue.volume=getSimpleVal("//issue/volume/text()");
		issue.number=getSimpleVal("//issue/number/text()");
		issue.articles=[];
		var sections=getNodes("//issue/section");
		_.each(sections,function(sec){
			var articleNodes = getNodes("child::article",sec);
			var property={};
			property.cn=getSimpleVal("child::title[@locale='zh-CN']/text()",sec);
			property.en=getSimpleVal("child::title[@locale='en-US']/text()",sec);
			_.each(articleNodes,function(articleNode){
				var article = {};
				article.property=property;
				article.language=getSimpleVal("child::language/text()",articleNode);
				article.doi=getSimpleVal("child::id[@type=\"doi\"]/text()",articleNode);
				issue.articles.push(article);
			})
		});
		callback(undefined,issue);
	};
	/**
	 * 异步方法
	 * 读取xml文件
	 */
	var readXml = function(){
		fs.readFile(filepath,'utf-8',function(err,data){
			if(err){ callback(err); return;}
			parse(data);
		})
	};
	/**
	 * 异步方法
	 * 判断文件是否存在
	 */
	var start = function(){
		fs.exists(filepath,function(info){
			if(info !== true){ callback(info); return;}
			readXml();
		});
	};
	//开始
	start();
};