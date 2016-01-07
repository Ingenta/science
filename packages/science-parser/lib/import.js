PastDataImport = function (path,pdfFolder) {

    var issueCreator = new ScienceXML.IssueCreator();
    var folder = path || "/Users/jack/ImportPastData/";
    logger.info("working folder is: " + folder);

    var getDoiSecondPart = function (doi) {
        if (doi) {
            var i = doi.indexOf("/");
            if (i > 0) {
                return doi.substr(i + 1);
            }
        }
        return doi;
    };

    var getTopic = function (subject) {
        if (subject && subject.en) {
            var topic = Topics.findOne({englishName: subject.en});
            if (topic)
                return topic._id;
        }
    };

    var isSameAffiliation = function (a, b) {
        return a.affText.cn === b.affText.cn;
    };

    var getAuthors = function (authorsArr) {
        if (!_.isEmpty(authorsArr)) {
            var authors = [];
            var affiliations = new Science.JSON.UniqueArray("id", isSameAffiliation, 1);
            var authorNotes = new Science.JSON.UniqueArray("id", undefined, 1);
            _.each(authorsArr, function (obj) {
                var author = {affs: []};
                if (obj.affiliation) {
                    var affCnArr = obj.affiliation.cn ? obj.affiliation.cn.split("#") : [];
                    var affEnArr = obj.affiliation.en ? obj.affiliation.en.split("#") : affCnArr;//如果没有英文工作单位信息，用中文代替。
                    if (_.isEmpty(affCnArr))
                        affCnArr = affEnArr;
                    for (var i = 0; i < affCnArr.length; i++) {
                        var index = affiliations.push({affText: {cn: affCnArr[i], en: affEnArr[i]}});
                        author.affs.push(index);
                    }
                    ;
                    author.affs = _.uniq(author.affs);
                }

                if (obj.isPrimary === 'true' && obj.email) {
                    var index = authorNotes.push({email: obj.email});
                    author.email = index;
                }

                author.surname = {en: obj.firstname, cn: obj.firstname};
                author.given = {
                    en: (obj.middlename || "" + " " + obj.lastname || ""),
                    cn: (obj.middlename || "" + " " + obj.lastname || "")
                };
                author.fullname = obj.authorname;
                if (author.fullname && author.fullname.cn) {
                    author.fullname.en = author.fullname.en || author.fullname.cn;
                }

                authors.push(author);

            });
            //为了与新数据格式保持一致,当只有一个地址(工作单位?)时,不显示地址上标
            //以下内容为此功能的实现.
            if (affiliations.count() <= 1) {
                authors = _.map(authors, function (author) {
                    delete author.affs;
                    return author;
                })
            }
            //------------end-------------
            return {authors: authors, affiliations: affiliations.getArray(), authorNotes: authorNotes.getArray()};
        }
    };

    var getReference = function (refs) {
        if (_.isEmpty(refs))
            return;
        return _.map(refs, function (ref) {
            var r = {};
            r.index = ref.no;
            r.id = ref.no;
            r.title = ref.title;
            r.year = ref.year;
            r.volume = ref.volume;
            r.firstPage = ref.startPage;
            r.lastPage = ref.endPage;
            r.fullContent = ref.fullContent;
            return r;
        })
    }

    var getFolder = function (issn) {
        var map = {
            "16747216": "sciA",
            "16747283": "sciAe",
            "16747224": "sciB",
            "16747291": "sciBe",
            "16747232": "sciC",
            "16747305": "sciCe",
            "16747240": "sciD",
            "16747313": "sciDe",
            "16747259": "sciE",
            "16747321": "sciEe",
            "16747267": "sciF",
            "1674733X": "sciFe",
            "16747275": "sciG",
            "16747348": "sciGe",
            "20958226": "sciH",
            "0023074X": "kxtb",
            "20959273": "kxtbe"
        }
        return map[issn.replace('-', '')];
    }

    var importPdf = function (issn, pdfName, callback) {
        if(!pdfName){
            logger.info("pdf name is empty.");
            callback && callback();
            return;
        }
        var folder = getFolder(issn);
        if (!folder) {
            logger.warning("can't find pdf folder of " + issn);
            callback && callback();
            return;
        }
        if(!pdfFolder){
            callback && callback();
            return;
        }
        var origPath = pdfFolder + folder + "/" + pdfName;
        Science.FSE.exists(origPath,Meteor.bindEnvironment( function (exists) {
            if(!exists){
                logger.error("can't find pdf folder of " + issn);
                callback && callback();
            }else{
                PdfStore.insert(origPath, function (err, fileObj) {
                    if (err) {
                        logger.error(err);
                        callback && callback();
                    }else{
                        logger.info("pdf imported");
                        callback && callback(fileObj._id)
                    }
                });
            }
        }))
    }

    var saveArticle = function(obj){
        var existArticle = Articles.findOne({doi: obj.doi});

        if (existArticle) {
            Articles.update({_id: existArticle._id}, {$set: obj});
            logger.info("update " + obj.doi + " successful");

        } else {
            Articles.insert(obj);
            logger.info("import " + obj.doi + " successful");
        }
    }

    var importQueue = new PowerQueue({
        maxProcessing: 1,//1并发
        maxFailures: 1 //不重试
    })

    importQueue.errorHandler = function (data) {

    };

    importQueue.taskHandler = function (data, next) {
        Parser(data.filepath, {}, Meteor.bindEnvironment(function (err, issue) {
            if (err)
                logger.error(err)
            if (!(issue && !_.isEmpty(issue.articles))) {
                logger.warn("articles not found in historical issue xml")
            } else {
                var journal = Publications.findOne({issn: issue.issn.replace('-', '')}, {
                    fields: {
                        title: 1,
                        titleCn: 1,
                        issn: 1,
                        EISSN: 1,
                        CN: 1,
                        publisher: 1,
                        accessKey:1
                    }
                });

                if (!journal) {
                    logger.warn("journal does not exist with issn: " + issue.issn);
                } else {
                    var vi = issueCreator.createIssue({
                        journalId: journal._id,
                        volume: issue.volume,
                        issue: issue.issue,
                        year: issue.year,
                        month: issue.month
                    });

                    _.each(issue.articles, function (article) {
                        logger.info("import " + article.doi + " started");
                        var newOne = {};
                        newOne.journalId = journal._id;
                        newOne.journal = journal;
                        newOne.volume = issue.volume;
                        newOne.issue = issue.issue;
                        newOne.year = issue.year;

                        newOne.volumeId = vi.volumeId;
                        newOne.issueId = vi.issueId;
                        newOne.doi = article.doi;
                        newOne.articledoi = getDoiSecondPart(article.doi);
                        newOne.title = article.title;
                        newOne.publisher = journal.publisher;
                        newOne.startPage = article.startPage;
                        newOne.elocationId = article.startPage;
                        newOne.accepted = Science.String.toDate(article.acceptDate);
                        newOne.published = Science.String.toDate(article.publishDate);
                        newOne.topic = getTopic(article.subspecialty);
                        newOne.contentType = article.contentType;
                        newOne.abstract = article.abstract;
                        var authors = getAuthors(article.authors);
                        if (!_.isEmpty(authors)) {
                            _.extend(newOne, authors);
                        }
                        newOne.keywords = article.indexing;
                        newOne.pubStatus = "normal";
                        newOne.accessKey = journal.accessKey;
                        newOne.language = article.language == 'zh_CN' ? 2 : 1;
                        var refs = getReference(article.citations);
                        if (!_.isEmpty(refs)) {
                            newOne.references = refs;
                        }

                        if(article.pdf){
                            var obj={};
                            importPdf(journal.issn,article.pdf,Meteor.bindEnvironment(function(result){
                                if(result)
                                    newOne.pdfId=result;
                                saveArticle(newOne);
                            }))
                        }else{
                            saveArticle(newOne)
                        }
                    })
                }
            }
            next();
        }));
    };

    Science.FSE.readdir(folder, Meteor.bindEnvironment(function (err, fileList) {
        if (err)
            throw err;
        _.each(fileList, function (file) {
            if (file && file.toLowerCase().endWith(".xml")) {
                importQueue.add({filepath: folder + file});
            }
        })
    }))
};


Meteor.methods({
    PastDataImportMethod: function (path,pdfFolder) {
        logger.info("Client request for historical data import");
        PastDataImport(path,pdfFolder);
    }
})

