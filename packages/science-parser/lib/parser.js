Parser = function(filepath,options,callback){
	var multiAttr={
		cn:"zh_CN",
		en:"en_US"
	};
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
		if(_.isEmpty(val) || _.isEmpty(val[0].childNodes))
			return;
		var datas = _.pluck(val[0].childNodes,"data");
		return datas.join("").trim();
	};
	/**
	 * 同步方法
	 * 获取dom元素的属性值
	 * @param xp
	 * @param ele
	 * @returns {void|*}
	 */
	var getAttribute=function(xp,ele){
		var attr = xpath.select(xp,ele || dom);
		return attr && attr[0].value;
	};
	/**
	 * 获取双语字段值
	 * @param xp
	 * @param ele
	 */
	var getMultiVal=function(xp,ele){
		var obj = {};
		var failedLang=[];
		var successLang;
		_.each(multiAttr,function(val,key){
			obj[key]=getSimpleVal(xp.replace('{lang}',val),ele);
			if(!obj[key])
				failedLang.push(key);
			else if(!successLang)
				successLang=key;
		});
		//若某语种未取到值,检查此字段是否有成功取到值的字段,如果有则用该语种内容填补未取到值的语种.
		if(!_.isEmpty(failedLang) && !_.isEmpty(multiAttr) && successLang){
			_.each(failedLang,function(key){
				obj[key]=obj[successLang];
			})
		}
		return obj;
	};

	var getNodes=function(xp,ele){
		return xpath.select(xp,ele || dom);
	};

	/**
	 * 异步方法
	 * 解析DOM
	 * @param data
	 */
	var parse = function(data){
		dom = new Science.Dom().parseFromString(data);
		var issue = {};
		issue.issn=getSimpleVal("//issue/issn");
		issue.journalName = getSimpleVal("//issue/journalname");
		issue.title=getSimpleVal("//issue/title");
		issue.year=getSimpleVal("//issue/year");
		issue.volume=getSimpleVal("//issue/volume");
		issue.issue=getSimpleVal("//issue/number");
		issue.articles=[];
		var sections=getNodes("//issue/section");
		_.each(sections,function(sec){
			var articleNodes = getNodes("child::article",sec);
			var property={};
			property=getMultiVal("child::title[@locale='{lang}']",sec);
			_.each(articleNodes,function(articleNode){
				var article = {};
				article.property=property;
				article.language=getSimpleVal("child::language",articleNode);
				article.doi=getSimpleVal("child::id[@type=\"doi\"]",articleNode);
				article.title=getMultiVal("child::title[@locale='{lang}']",articleNode);
				article.subject=getMultiVal("child::subject[@locale='{lang}']",articleNode);
				article.subspecialty=getMultiVal("child::subspecialty[@locale='{lang}']",articleNode);
				article.abstract=getMultiVal("child::abstract[@locale='{lang}']",articleNode);
				article.indexing=getMultiVal("child::indexing/subject[@locale='{lang}']",articleNode);
				article.pages=getSimpleVal("child::pages",articleNode);
				article.startPage=getSimpleVal("child::start_page",articleNode);
				article.endPage=getSimpleVal("child::endPage",articleNode);
				article.pdf=getAttribute("child::galley/file/href/attribute::src",articleNode);
				article.publishDate=getSimpleVal("child::publish_date",articleNode);
				article.acceptDate=getSimpleVal("child::accept_date",articleNode);
				article.authors=[];
				var authorNodes=getNodes("child::author",articleNode);
				_.each(authorNodes,function(authorNode){
					var author = {};
					author.isPrimary=getAttribute("attribute::primary_contact",authorNode);
					author.firstname=getSimpleVal("child::firstname",authorNode);
					author.middlename=getSimpleVal("child::middlename",authorNode);
					author.lastname=getSimpleVal("child::lastname",authorNode);
					author.authorname=getMultiVal("child::authorname[@locale='{lang}']",authorNode);
					author.affiliation=getMultiVal("child::affiliation[@locale='{lang}']",authorNode);
					author.email=getSimpleVal("child::email",authorNode);
					article.authors.push(author);
				});
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