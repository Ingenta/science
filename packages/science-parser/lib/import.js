PastDataImport = function (path, pdfFolder, userOptions) {

    var issueCreator = new ScienceXML.IssueCreator();
    var folder = path || "/Users/jack/ImportPastData/";
    logger.info("working folder is: " + folder);
    pdfFolder && logger.info("pdf folder is: " + pdfFolder);

    var options = {
        maxProc: 1,
        createVI: true,
        importArticle: true,
        importPdf: true
    }
    if (!_.isEmpty(userOptions)) {
        options.maxProc = _.isNumber(userOptions.maxProc) ? userOptions.maxProc : options.maxProc;
        options.createVI = _.isBoolean(userOptions.createVI) ? userOptions.createVI : options.createVI;
        options.importArticle = _.isBoolean(userOptions.importArticle) ? userOptions.importArticle : options.importArticle;
        options.importPdf = _.isBoolean(userOptions.importPdf) ? userOptions.importPdf : options.importPdf;
    }
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
                return [topic._id];
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

                author.surname = {en: obj.lastname, cn: obj.lastname};
                author.given = {en: obj.firstname, cn: obj.firstname};
                author.middle = {en: obj.middlename, cn: obj.middlename};
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
            "10069232": "sciA",
            "10003126": "sciA",
            "10000001": "sciA",

            "16747283": "sciAe",
            "10000002": "sciAe",
            "02535831": "sciAe",
            "10069283": "sciAe",

            "10000003": "sciB",
            "10003134": "sciB",
            "10069240": "sciB",
            "16747224": "sciB",

            "02535823": "sciBe",
            "1001652X": "sciBe",
            "10069291": "sciBe",
            "16747291": "sciBe",

            "10069259": "sciC",
            "16747232": "sciC",

            "10069305": "sciCe",
            "16747305": "sciCe",

            "10069267": "sciD",
            "16747240": "sciD",

            "10069313": "sciDe",
            "16747313": "sciDe",

            "10069275": "sciE",
            "16747259": "sciE",

            "10069321": "sciEe",
            "16747321": "sciEe",

            "16745973": "sciF",
            "16747267": "sciF",

            "10092757": "sciFe",
            "1674733X": "sciFe",

            "16721780": "sciG",
            "16747275": "sciG",

            "16721799": "sciGe",
            "16747348": "sciGe",

            "20958226": "sciHe", //材料科学没有变更记录

            "0023074X": "kxtb", //科学通报中文 无变更记录

            "10016538": "kxtbe",
            "20959273": "kxtbe"
        }
        return map[issn.replace('-', '')];
    }

    var importPdf = function (issn, pdfName, callback) {
        if (!pdfName) {
            logger.info("pdf name is empty.");
            callback && callback();
            return;
        }
        var journalPdfFolder = getFolder(issn);
        if (!folder) {
            logger.warn("can't find pdf folder of " + issn);
            callback && callback();
            return;
        }
        if (!pdfFolder) {
            callback && callback();
            return;
        }
        var origPath = pdfFolder + journalPdfFolder + "/" + pdfName;
        Science.FSE.exists(origPath, Meteor.bindEnvironment(function (exists) {
            if (!exists) {
                logger.error("can't find pdf of " + origPath);
                callback && callback();
            } else {
                var newPdfFolder = Config.staticFiles.uploadPdfDir + "/" + issn;
                var newPdfPath = newPdfFolder + "/" + pdfName;
                ScienceXML.FolderExists(newPdfFolder);
                ScienceXML.CopyFile(origPath, newPdfPath);
                callback && callback(newPdfPath);
            }
        }))
    }

    var saveArticle = function (obj) {
        var existArticle = Articles.findOne({doi: obj.doi});

        if (existArticle) {
            Articles.update({_id: existArticle._id}, {$set: obj});
            logger.info("update " + obj.doi + " successful");

        } else {
            Articles.insert(obj);
            logger.info("import " + obj.doi + " successful");
        }
    }


    var insertKeywords = function (a) {
        if (!a)return;
        if (a.cn) {
            a.cn.forEach(function (name) {
                if (!Keywords.findOne({name: name})) {
                    Keywords.insert({
                        lang: "cn",
                        name: name,
                        score: 0
                    });
                }
            })
        }
        if (a.en) {
            a.en.forEach(function (name) {
                if (!Keywords.findOne({name: name})) {
                    Keywords.insert({
                        lang: "en",
                        name: name,
                        score: 0
                    });
                }
            })
        }
    }

    var importQueue = new PowerQueue({
        maxProcessing: options.maxProc,//并发
        maxFailures: 1 //不重试
    })

    importQueue.errorHandler = function (data) {

    };

    importQueue.taskHandler = function (data, next) {
        Parser(data.filepath, options, Meteor.bindEnvironment(function (err, issue) {
            if (err)
                logger.error(err)
            if (!(issue && !_.isEmpty(issue.articles)) && (options.importArticle || options.importPdf)) {
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
                        accessKey: 1
                    }
                });

                if (!journal) {
                    logger.warn("journal does not exist with issn: " + issue.issn);
                } else {
                    var vi;
                    if (options.createVI) {
                        vi = issueCreator.createIssue({
                            journalId: journal._id,
                            volume: issue.volume,
                            issue: issue.issue,
                            year: issue.year,
                            month: issue.month
                        });
                        logger.info("created volume: " + issue.volume + ", issue: " + issue.issue);
                    } else {
                        var volumeObj = Volumes.findOne({journalId: journal._id, volume: issue.volume})._id;
                        var issueObj = Issues.findOne({
                            journalId: journal._id,
                            volume: issue.volume,
                            issue: issue.issue
                        });
                        if (volumeObj && issueObj) {
                            vi = {
                                volumeId: volumeObj._id,
                                issueId: issueObj._id
                            }
                        }
                    }
                    if (!vi) {
                        logger.error("can't find volume&issue from: " + data.filepath);
                    }
                    if (vi && (options.importArticle || options.importPdf)) {
                        _.each(issue.articles, function (article) {
                            if(!article.doi){
                                logger.error("article info with out doi,journalId:"+journal._id+", volume:"+issue.volume + ", issue:"+issue.issue);
                            }else{
                                logger.info("import " + article.doi + " started");
                                var newOne = {};
                                if (options.importArticle) {
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
                                    newOne.endPage = article.endPage;
                                    newOne.elocationId = article.startPage;
                                    newOne.accepted = Science.String.toDate(article.acceptDate);
                                    newOne.published = Science.String.toDate(article.publishDate);
                                    newOne.topic = getTopic(article.subspecialty);
                                    newOne.contentType = article.contentType;
                                    newOne.abstract = article.abstract;
                                    var authors = getAuthors(article.authors);
                                    if (!_.isEmpty(authors)) {
                                        _.extend(newOne,authors);
                                        if(!_.isEmpty(newOne.authors)){
                                            var orderAuthors={cn:"",en:""};
                                            _.each(newOne.authors,function(author){
                                                if(!_.isEmpty(author.fullname)){
                                                    if(_.isString(author.fullname.cn) && author.fullname.cn.trim())
                                                        orderAuthors.cn+=author.fullname.cn.trim()+"|";
                                                    if(_.isString(author.fullname.en) && author.fullname.en.trim())
                                                        orderAuthors.en+=author.fullname.en.trim()+"|";
                                                }
                                            })
                                            newOne.orderAuthors=orderAuthors;
                                        }
                                    }
                                    newOne.keywords = article.indexing;
                                    insertKeywords(newOne.keywords);
                                    newOne.pubStatus = "normal";
                                    newOne.accessKey = journal.accessKey;
                                    newOne.language = article.language == 'zh_CN' ? 2 : 1;
                                    var refs = getReference(article.citations);
                                    if (!_.isEmpty(refs)) {
                                        newOne.references = refs;
                                    }

                                    var padPage = article.elocationId || article.startPage || "";
                                    if(padPage){
                                        newOne.padPage = newOne.journal.issn+Science.String.PadLeft(newOne.volume || "novolume","0",8)+Science.String.PadLeft(newOne.issue || "noissue","0",8)+Science.String.PadLeft(padPage,"0",10);
                                        var atcendpage= article.endPage || "";
                                        if(atcendpage){
                                            newOne.padPage = newOne.journal.issn+Science.String.PadLeft(newOne.volume || "novolume","0",8)+Science.String.PadLeft(newOne.issue || "noissue","0",8)+Science.String.PadLeft(padPage,"0",10)+Science.String.PadLeft(atcendpage,"0",10);
                                        }
                                    }
                                }
                                if (options.importPdf && article.pdf) {
                                    var a = Articles.findOne({doi: article.doi}, {fields: {pdfId: 1}});
                                    if (!a || !a.pdfId) {//已经成功上传过pdf不再处理
                                        importPdf(journal.issn, article.pdf, Meteor.bindEnvironment(function (result) {
                                            if (result) {
                                                newOne.pdfId = result;
                                                logger.info("pdf imported for: " + article.doi);
                                            }
                                            saveArticle(newOne);
                                        }))
                                    } else {
                                        logger.info("import " + article.doi + " skipped");
                                    }
                                } else if (options.importArticle) {
                                    saveArticle(newOne)
                                }
                            }
                        })
                    }
                }
            }
            Science.FSE.remove(data.filepath, function (e) {
                if (e) console.log(e);
                else logger.info('xml file removed');
            })
            next();
        }));
    };

    Science.FSE.readdir(folder, Meteor.bindEnvironment(function (err, fileList) {
        if (err)
            logger.error(err);
        _.each(fileList, function (file) {
            if (file && file.toLowerCase().endWith(".xml")) {
                importQueue.add({filepath: folder + file});
            }
        })
    }))
};


Meteor.methods({
    PastDataImportMethod: function (path, pdfFolder, options) {
        logger.info("Client request for historical data import");
        if(Permissions.isAdmin(Meteor.user())){
            PastDataImport(path, pdfFolder, options);
            return "Import task working...";
        }else{
            return "Permission denied";
        }
    }
})

////-----------------------------------------------------------------
////由于旧数据导入运行一段时间(约半小时)后,出现一个未知错误会导致服务崩溃重启,
////为了不影响数据导入的时间,加入这段代码,重启后继续执行旧数据导入程序.
////待旧数据导入工作完成后，删除这段代码
//if (Meteor.isServer && process.env.RUN_TASKS) {
//    Meteor.startup(function () {
//        PastDataImport("/bundle/import/", "/bundle/allpdf/");
//    })
//}
////-----------------------------------------------------------------