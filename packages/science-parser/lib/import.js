PastDataImport = function () {
	var folder = "/Users/jiangkai/WORK/ImportPastData/";

	var ensureVolIss = function (journalId, issueObj) {
		var volume = Volumes.findOne({journalId: journalId, volume: issueObj.volume});
		if (!volume) {
			volume = Volumes.insert({
				journalId: journalId,
				volume   : issueObj.volume
			});
		}

		var issue = Issues.findOne({journalId: journalId, volume: issueObj.volume, issue: issueObj.number});
		if (!issue) {
			issue = Issues.insert({
				journalId: journalId,
				volume   : issueObj.volume,
				issue    : issueObj.number,
				year     : issueObj.year,
				month    : issueObj.month || "1"
			});
		}

		return {volumeId: volume._id || volume, issueId: issue._id || issue};
	};

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

	var getAuthors = function(authors){
		if(!_.isEmpty(authors)){
			var authors = [];
			var affiliations = [];
			_.each(authors,function(obj){
				var author={};
				author.surname={en:obj.firstname,cn:obj.firstname};
				author.given={
					en:(obj.middlename || "" + " " + obj.lastname || ""),
					cn:(obj.middlename || "" + " " + obj.lastname || "")
				}
				authors.push(author);
				if(author.affiliation){
					affiliations.push(author);
				}
			})
			return {authors:authors,affiliations:affiliations};
		}
	}

	Science.FSE.readdir(folder,Meteor.bindEnvironment( function (err, fileList) {
		if (err)
			throw err;
		_.each(fileList, function (file) {
			if (file && file.toLowerCase().endWith(".xml")) {
				Parser(folder+file,{}, Meteor.bindEnvironment(function (err, issue) {
					if (err)
						console.dir(err) ;
					if (issue && !_.isEmpty(issue.articles)) {
						var journal =  Publications.findOne({issn: issue.issn.replace('-','')});
						if (journal) {
							var vi = ensureVolIss(journal._id, issue);
							_.each(issue.articles, function (article) {
								console.log("import "+article.doi + " start");
								var newOne = {};
								newOne.journalId=journal._id;
								newOne.volume=issue.volume;
								newOne.issue=issue.number;
								newOne.volumeId=vi.volumeId;
								newOne.issueId=vi.issueId;
								newOne.doi=article.doi;
								newOne.articledoi = getDoiSecondPart(article.doi);
								newOne.title=article.title;
								newOne.publisher=journal.publisher;
								newOne.startPage=article.startPage;
								newOne.year=article.year;
								newOne.accepted=article.accepted;
								newOne.published=article.published;
								newOne.topic=getTopic(article.subspecialty);
								newOne.articleType=article.property.en;
								var authors=getAuthors(article.authors);
								if(authors){
									_.extend(newOne,authors);
								}
								newOne.keywords=article.indexing;
								newOne.pubStatus="normal";
								newOne.accessKey=journal.accessKey;
								newOne.language=article.language;
								Articles.insert(newOne);
								console.log("import "+newOne.doi + " successfully");
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

