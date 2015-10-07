PastDataImport = function () {
	var folder = "/Users/jiangkai/WORK/ImportPastData/";

	var issueCreator = new ScienceXML.IssueCreator();

	var getDoiSecondPart = function(doi){
		if(doi){
			var i = doi.indexOf("/");
			if(i>0){
				return doi.substr(i+1);
			}
		}
		return doi;
	};

	var getTopic = function(subject){
		if(subject && subject.en){
			var topic = Topics.findOne({englishName:subject.en});
			if(topic)
				return topic._id;
		}
	};

	var isSameAffiliation = function(a,b){
		return a.affText.cn===b.affText.cn;
	};

	var getAuthors = function(authorsArr){
		if(!_.isEmpty(authorsArr)){
			var authors = [];
			var affiliations = new Science.JSON.UniqueArray("id",isSameAffiliation);
			var authorNotes = new Science.JSON.UniqueArray("label");
			_.each(authorsArr,function(obj){
				var author={affRef:[]};
				if(obj.affiliation){
					var affCnArr = obj.affiliation.cn.split("#");
					var affEnArr = obj.affiliation.en?obj.affiliation.en.split("#"):affCnArr;//如果没有英文工作单位信息，用中文代替。
					for(var i=0;i<affCnArr.length;i++){
						var index = affiliations.push({affText:{cn:affCnArr[i],en:affEnArr[i]}});
						author.affRef.push(index);
					};
					author.affRef= _.uniq(author.affRef);
				}

				if(obj.isPrimary === 'true' && obj.email){
					var index = authorNotes.push({email:obj.email});
					author.emailRef=index;
				}

				author.surname={en:obj.firstname,cn:obj.firstname};
				author.given={
					en:(obj.middlename || "" + " " + obj.lastname || ""),
					cn:(obj.middlename || "" + " " + obj.lastname || "")
				};
				author.fullname=obj.authorname;
				if(author.fullname && author.fullname.cn){
					author.fullname.en=author.fullname.en || author.fullname.cn;
				}

				authors.push(author);

			});
			return {authors:authors,affiliations:affiliations.getArray(),authorNotes:authorNotes.getArray()};
		}
	};

	Science.FSE.readdir(folder,Meteor.bindEnvironment( function (err, fileList) {
		if (err)
			throw err;
		_.each(fileList, function (file) {
			if (file && file.toLowerCase().endWith(".xml")) {
				Parser(folder+file,{}, Meteor.bindEnvironment(function (err, issue) {
					if (err)
						console.dir(err) ;
					if (issue && !_.isEmpty(issue.articles)) {
						var journal =  Publications.findOne({issn: issue.issn.replace('-','')},{fields:{title:1,titleCn:1,issn:1,EISSN:1,CN:1,publisher:1}});

						if (journal) {

							var vi = issueCreator.createIssue({
								journalId:journal._id,
								volume:issue.volume,
								issue:issue.issue,
								year:issue.year,
								month:issue.month
							});

							_.each(issue.articles, function (article) {
								console.log("import "+article.doi + " start");
								var newOne = {};
								newOne.journalId=journal._id;
								newOne.journalInfo=journal;
								newOne.volume=issue.volume;
								newOne.issue=issue.number;
								newOne.year=issue.year;

								newOne.volumeId=vi.volumeId;
								newOne.issueId=vi.issueId;
								newOne.doi=article.doi;
								newOne.articledoi = getDoiSecondPart(article.doi);
								newOne.title=article.title;
								newOne.publisher=journal.publisher;
								newOne.startPage=article.startPage;
								newOne.accepted=article.acceptDate;
								newOne.published=article.publishDate;
								newOne.topic=getTopic(article.subspecialty);
								newOne.articleType=article.property.en;
								var authors=getAuthors(article.authors);
								if(authors){
									_.extend(newOne,authors);
								}
								newOne.keywords=article.indexing;
								newOne.pubStatus="normal";
								newOne.accessKey=journal.accessKey;
								newOne.language=article.language=='zh_CN'?2:1;

								var existArticle = Articles.findOne({doi: newOne.doi});
								if(existArticle){
									Articles.update({_id:existArticle._id},{$set:newOne});
									console.log("update "+newOne.doi + " successfully");

								}else{
									Articles.insert(newOne);
									console.log("import "+newOne.doi + " successfully");
								}

							})
						} else {
							console.log("journal not exists");
						}
					}else{
						console.log("article not found")
					}
				}));
			}
		})
	}))
};


Meteor.startup(function(){
	//PastDataImport();
})

