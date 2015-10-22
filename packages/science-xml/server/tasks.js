Tasks = {};

Tasks.startJob = function (pathToFile, fileName, fileType, formFields) {

	if (!pathToFile || !fileName || !fileType)return;
	var fileNameWithoutExtension = fileName.substr(0, fileName.lastIndexOf("."));
	//文章的出版状态(默认是正式出版)
	var pubstatus = formFields ? formFields.pubStatus : "normal";

	var logId = UploadLog.insert({
		name      : fileName,
		pubStatus : pubstatus,
		uploadedAt: new Date(),
		status    : "Started",
		filePath  : pathToFile,
		filename  : fileNameWithoutExtension,
		errors    : []
	});
	if (Tasks.inProgress(undefined, logId, fileNameWithoutExtension)) {
		return;
	}

	if (fileType === "text/xml") {
		Tasks.parse(logId, pathToFile);
		return;
	}

	if (fileName.endWith(".zip")) {
		//extract to a folder with the same name inside extracted folder
		var targetPath = Config.uploadXmlDir.uploadDir + "/extracted/" + fileNameWithoutExtension;
		Tasks.extract(logId, pathToFile, targetPath);
		return;
	}
	Tasks.failSimple(undefined, logId, "Filetype is not suitable: " + fileType);
};

Tasks.fail = function (taskId, logId, errors) {
	if (taskId)
		UploadTasks.update({_id: taskId}, {$set: {status: "Failed"}});
	UploadLog.update({_id: logId}, {$set: {status: "Failed", errors: errors}});

	var log = UploadLog.findOne({_id: logId});
	ScienceXML.RemoveFile(log.filePath);
	if (log.extractTo)
		ScienceXML.RemoveFile(log.extractTo);
}

Tasks.failSimple = function (taskId, logId, errorMessage) {
	var e = [];
	e=_.union(e,errorMessage);
	Tasks.fail(taskId, logId, e);
}

Tasks.hasExistingArticleByFullDoi = function (taskId, logId, doi) {
	var existingArticle = Articles.findOne({doi: doi});
	if (!existingArticle)return false;
	Tasks.failSimple(taskId, logId, "Article found matching this DOI: " + doi);
	return true;
}

Tasks.hasExistingArticleByArticleDoi = function (taskId, logId, articledoi) {
	var existingArticle = Articles.findOne({articledoi: articledoi});
	if (!existingArticle)return false;
	Tasks.failSimple(taskId, logId, "Article found matching this article DOI: " + articledoi);
	return true;
}

Tasks.inProgress = function (taskId, logId, filename) {
	var existingLog = UploadLog.findOne({_id: logId});
	if (existingLog) {
		if (existingLog.status !== 'Pending') {
			//set to in progress(pending)
			UploadLog.update({_id: logId}, {$set: {status: "Pending"}});
			return false;
		}
		Tasks.failSimple(taskId, logId, "Import in progress matching this filename: " + filename);
	}
	return true;
}

Tasks.extract = function (logId, pathToFile, targetPath) {
	var taskId = UploadTasks.insert({
		action : "Extract",
		started: new Date(),
		status : "Started",
		logId  : logId
	});

	extractZip(pathToFile, targetPath, true,
		Meteor.bindEnvironment(
			function (error) {
				if (error) {
					console.log("Error extracting ZIP file: " + error);//report error
					//THIS DOESNT REALLY WORK
					//TODO: test this condition
					return;
				}
				//set extract task to success, cleanup and start next task
				UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
				//get target xml filename TODO: make this better
				FSE.readdir(targetPath,
					Meteor.bindEnvironment(
						function (err, file) {
							if (err) {
								console.log(err);
								//TODO: test this condition
								return;
							}
							var xmlFileName = "";
							file.forEach(function (f) {
								if (f.endWith('.xml') && f !== "readme.xml") {
									xmlFileName = f.substr(0, f.lastIndexOf(".xml"));
									//TODO: should break here, or better yet find a better means of finding the xml
								}
							});
							if (!xmlFileName) {
								Tasks.failSimple(taskId, logId, "xml not found inside zip file");
								return;
							}

							var targetXml = targetPath + "/" + xmlFileName + ".xml";
							var targetPdf = targetPath + "/" + xmlFileName + ".pdf";//pdf默认位置，若xml内容中有指定pdf则以xml中的位置优先
							UploadLog.update({_id: logId}, {
								$set: {
									xml      : targetXml,
									pdf      : targetPdf,
									extractTo: targetPath
								}
							});
							Tasks.parse(logId, targetXml);

						}));
			}));
}

Tasks.parse = function (logId, pathToXml) {
	var log    = UploadLog.findOne({_id: logId});
	var taskId = UploadTasks.insert({
		action : "Parse",
		started: new Date(),
		status : "Started",
		logId  : logId
	});
	try {
		var result = ScienceXML.parseXml(pathToXml);
		if (result.pdf) {
			log.errors = result.errors;
		}
		if (log.errors.length) {
			Tasks.fail(taskId, logId, log.errors);
			return;
		}
		//set parse task to success and start next task
		UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});

		//start import tasks
		Tasks.insertArticlePdf(logId, result);
	} catch (e) {
		log.errors.push(e.toString());
		Tasks.fail(taskId, logId, log.errors);
	}
}


Tasks.insertArticlePdf = function (logId, result) {
	var log = UploadLog.findOne({_id: logId});
	if (!ScienceXML.FileExists(log.pdf)) {
		console.log("pdf missing");
		Tasks.insertArticleImages(logId, result);
		return;
	}
	var taskId = UploadTasks.insert({
		action : "Insert PDF",
		started: new Date(),
		status : "Started",
		logId  : logId
	});
	Collections.Pdfs.insert(log.pdf, function (err, fileObj) {
		result.pdfId = fileObj._id;
		UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
		UploadLog.update({_id: logId}, {$set: {pdfId: fileObj._id}});
		Tasks.insertArticleImages(logId, result);
	});
}

Tasks.insertArticleImages = function (logId, result) {
	var taskId = UploadTasks.insert({
		action : "Insert Images",
		started: new Date(),
		status : "Started",
		logId  : logId
	});

	var log = UploadLog.findOne({_id: logId});
	if (!result.figures) {
		if (log.extractTo)Meteor.setTimeout(ScienceXML.RemoveFile(log.extractTo), 20000);
	}
	else {
		result.figures.forEach(function (fig) {
			var onlineOne = _.findWhere(fig.graphics, {use: "online"});
			// 兼容中国科学数据
			onlineOne = onlineOne || _.find(fig.graphics, function (g) {
					return !g.use;
				});
			if (onlineOne) {
				console.dir(onlineOne);
				var figName     = onlineOne.href;
				var figLocation = log.extractTo + "/" + figName;
				if (!ScienceXML.FileExists(figLocation)) {
					console.log("image missing: " + figName);
				}
				else {
					ArticleXml.insert(figLocation, function (err, fileObj) {
						fig.imageId = fileObj._id;
						UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
						if (_.last(result.figures) === fig) {
							Meteor.setTimeout(function () {
								ScienceXML.RemoveFile(log.extractTo);
							}, 20000)
						}
					});
				}
			}
		});
	}

	Tasks.insertArticleTask(logId, result);
}


Tasks.insertArticleTask = function (logId, result) {
	var taskId = UploadTasks.insert({
		action : "Insert",
		started: new Date(),
		status : "Started",
		logId  : logId
	});

	var hadError = false;
	var articleId;

	var log          = UploadLog.findOne({_id: logId});
	result.pubStatus = log.pubStatus;//设置文章的出版状态和上传时选择的出版状态一致。

	try {
		articleId = insertArticle(result);
		if(articleId){
			insertAccessKey(result);
			insertLanguage(result);
			insertKeywords(result.keywords);
		}
	}
	catch (ex) {
		Tasks.failSimple(taskId, logId, _.union(result.errors,ex.message));
		hadError = true;
	}
	if (!hadError) {
		//cleanup and set log and tasks to done
		ScienceXML.RemoveFile(log.filePath);
		UploadTasks.update(
			{_id: taskId},
			{$set: {status: "Success"}});
		UploadLog.update(
			{_id: logId},
			{$set: {status: "Success", articleId: articleId}}
		);
	}
}
var insertKeywords      = function (a) {
	if (!a)return;
	if (a.cn) {
		a.cn.forEach(function (name) {
			if (!Keywords.findOne({name: name})) {
				Keywords.insert({
					lang : "cn",
					name : name,
					score: 0
				});
			}
		})
	}
	if (a.en) {
		a.en.forEach(function (name) {
			if (!Keywords.findOne({name: name})) {
				Keywords.insert({
					lang : "en",
					name : name,
					score: 0
				});
			}
		})
	}
	//a.forEach(function (name) {
	//    if (!Keywords.findOne({name: name})) {
	//        Keywords.insert({
	//            name: name,
	//            score: 0
	//        });
	//    }
	//})
}

var insertAccessKey = function (a) {
	a.accessKey = Publications.findOne({_id: a.journalId}).accessKey;
};

var insertLanguage = function (a) {
	a.language = Publications.findOne({_id: a.journalId}).language;
};

var insertArticle = function (a) {
	var volume = Volumes.findOne({journalId: a.journalId, volume: a.volume});
	if (!volume) {
		volume = Volumes.insert({
			journalId: a.journalId,
			volume   : a.volume
		});
	}
	a.volumeId = volume._id || volume;

	var issue = Issues.findOne({journalId: a.journalId, volume: a.volume, issue: a.issue});
	if (!issue) {
		issue = Issues.insert({
			journalId: a.journalId,
			volume   : a.volume,
			issue    : a.issue,
			year     : a.year,
			month    : a.month
		});
	}
	//确保article有一个关联的issue
	a.issueId = issue._id || issue;

	//若DOI已存在于数据库中，则更新配置文件中设置的指定字段内容。
	var existArticle = Articles.findOne({doi: a.doi});
	if (existArticle) {
		var sets = _.pick(a, Config.fieldsWhichFromXml);
		Articles.update({_id: existArticle._id}, {$set: sets});
		return existArticle._id;
	}

	var journalInfo = Publications.findOne({_id: a.journalId}, {
		fields: {
			title  : 1,
			titleCn: 1,
			issn   : 1,
			EISSN  : 1,
			CN     : 1
		}
	});
	a.journalInfo   = journalInfo;

	//如果以后这里增加了新的字段，不要忘记更新Config中的fieldsWhichFromXml
	var id = Articles.insert({
		doi             : a.doi,
		articledoi      : a.articledoi,
		title           : a.title,
		abstract        : a.abstract,
		journalId       : a.journalId,
		journal         : a.journalInfo,//journal是后加的
		publisher       : a.publisher,
		elocationId     : a.elocationId,
		year            : a.year,
		month           : a.month,
		issue           : a.issue,
		volume          : a.volume,
		issueId         : a.issueId,
		volumeId        : a.volumeId,
		received        : a.received,
		accepted        : a.accepted,
		published       : a.published,
		topic           : [a.topic],
		contentType     : a.contentType,
		acknowledgements: a.ack,
		pdfId           : a.pdfId,
		authors         : a.authors,
		authorNotes     : a.authorNotes,
		affiliations    : a.affiliations,
		sections        : a.sections,
		figures         : a.figures,
		tables          : a.tables,
		keywords        : a.keywords,
		references      : a.references,
		pubStatus       : a.pubStatus, //出版状态
		accessKey       : a.accessKey,
		language        : a.language
	});
	return id;
};

var j = {
	errors       : [
		'No keywords found',
		'No such issn found in journal collection: 1674-7348'],
	doi          : '10.1007/s11433-015-5733-0',
	articledoi   : 's11433-015-5733-0',
	title        : {
		en: 'On the structure of isomeric state in\r\nneutron-rich ',
		cn: 'On the structure of isomeric state in\r\nneutron-rich '
	},
	contentType  : 'article',
	volume       : '58',
	issue        : '11',
	month        : '11',
	year         : '2015',
	elocationId  : '112003',
	essn         : '1869-1927',
	journalTitle : 'SCIENCE CHINA Physics, Mechanics & Astronomy',
	issn         : '16747348',
	publisherName: 'Science China Press',
	references   : [
		{
		ref: '\r\n\r\nJanssens\r\nR V F\r\nNuclear physics: elusive magic numbers\r\nNature (London)2005\r\n435\r\n897\r\n898',
		doi: '10.1038/435897a '
	},
		{
			ref: '\r\n\r\nLi\r\nZ YWang\r\nY ZYu\r\nG L et al\r\nTensor force effect on proton shell structure in neutron-rich\r\nCa isotopesSci China-Phys Mech Astron2013\r\n56\r\n1719\r\n1729',
			doi: '10.1007/s11433-013-5143-0 '
		},
		{ref: '\r\n\r\nCasten\r\nR F\r\nShape evolution in nucleiIn: Computational and Group-Theoretical\r\nMethods in Nuclear Physics\r\nSingapore\r\nWorld Scientific Publishing Co Pte Ltd\r\n2003\r\n91\r\n98\r\n'},
		{ref: '\r\n\r\nCakirli\r\nR BCasten\r\nR F\r\nEmpirical signature for shape transition mediated by\r\nsub-shell changesPhys Rev C2008\r\n78\r\n041301(R)\r\n\r\n'},
		{
			ref: '\r\n\r\nSumikama\r\nTYoshinaga\r\nKWatanabe\r\nH et al\r\nStructural evolution in the neutron-rich nuclei106Zr and108ZrPhys Rev Lett2011\r\n106\r\n202501\r\n',
			doi: '10.1103/PhysRevLett.106.202501 '
		},
		{
			ref: '\r\n\r\nWood\r\nJHeyde\r\nKNazarewicz\r\nW et al\r\nCoexistence in even-mass nucleiPhys Rep1992\r\n215\r\n101\r\n201',
			doi: '10.1016/0370-1573(92)90095-H '
		},
		{
			ref: '\r\n\r\nSkalski\r\nJMizutori\r\nKNazarewicz\r\nW\r\nEquilibrium shapes and high-  spin properties of the\r\nneutron-richA ≈110 nuclei\r\nNucl Phys A1997\r\n617\r\n282\r\n315',
			doi: '10.1016/S0375-9474(97)00125-5 '
		},
		{
			ref: '\r\n\r\nSchunck\r\nNDudek\r\nJGóźdź\r\nA et al\r\nTetrahedral symmetry in ground and low-lying states\r\nof exoticA~110 nucleiPhys Rev C2004\r\n69\r\n061305(R)\r\n',
			doi: '10.1103/PhysRevC.69.061305 '
		},
		{
			ref: '\r\n\r\nWanajo\r\nSIshimaru\r\nY\r\nr-process calculations and Galactic\r\nchemical evolutionNucl Phys A2006\r\n777\r\n676\r\n699',
			doi: '10.1016/j.nuclphysa.2005.10.012 '
		},
		{
			ref: '\r\n\r\nZhang\r\nY JChen\r\nY SGuo\r\nJ Y et al\r\nNuclear uncertainties in the s-process simulation\r\nSci China-Phys Mech Astron2013\r\n56\r\n859\r\n865',
			doi: '10.1007/s11433-013-5067-8 '
		},
		{
			ref: '\r\n\r\nWalker\r\nP MDracoulis\r\nG D\r\nEnergy traps in atomic nucleiNature1999\r\n399\r\n35\r\n40',
			doi: '10.1038/19911 '
		},
		{
			ref: '\r\n\r\nTu\r\nYChen\r\nY SGao\r\nZ C et al\r\nProjected total energy surface description for axial\r\nshape asymmetry in172WSci China-Phys Mech Astron2014\r\n57\r\n2054\r\n2059',
			doi: '10.1007/s11433-014-5572-4 '
		},
		{
			ref: '\r\n\r\nFu\r\nX MJiao\r\nC FXu\r\nF R et al\r\nMulti-quasiparticle rotational bands in neutron-rich\r\nerbium isotopesSci China-Phys Mech Astron2013\r\n56\r\n1423\r\n1427',
			doi: '10.1007/s11433-013-5165-7 '
		},
		{
			ref: '\r\n\r\nYang\r\nY CSun\r\nY\r\nStructure analysis of159Sm and properties\r\nof odd-mass neutron-rich nuclei in mass-160 region\r\nSci China-Phys Mech Astron2011\r\n54\r\n81\r\n87',
			doi: '10.1007/s11433-011-4411-0 '
		},
		{
			ref: '\r\n\r\nLiu\r\nH LXu\r\nF R\r\nCalculations of electric quadrupole moments and charge\r\nradii for high-K isomersSci China-Phys Mech Astron2013\r\n56\r\n2037\r\n2041',
			doi: '10.1007/s11433-013-5330-z '
		},
		{
			ref: '\r\n\r\nXie\r\nK PKe\r\nW YLiang\r\nW Y et al\r\nCollective rotations of fission isomers in actinide\r\nnucleiSci China-Phys Mech Astron2014\r\n57\r\n189\r\n193',
			doi: '10.1007/s11433-013-5379-8 '
		},
		{
			ref: '\r\n\r\nZheng\r\nYZhu\r\nL HChen\r\nY S et al\r\nDramatic transition between  electric and magnetic\r\nrotations in106 AgSci China-Phys Mech Astron2014\r\n57\r\n1669\r\n1675',
			doi: '10.1007/s11433-014-5533-y '
		},
		{
			ref: '\r\n\r\nJentschel\r\nMUrban\r\nWKrempel\r\nJ et al\r\nUltrahigh-resolution  γ-ray spectroscopy of156Gd: A test of tetrahedral symmetryPhys Rev Lett2010\r\n104\r\n222502\r\n',
			doi: '10.1103/PhysRevLett.104.222502 '
		},
		{ref: '\r\n\r\nDudek\r\nJSchunck\r\nNGóźdź\r\nA\r\nAtomic nuclei with tetrahedral and octahedral symmetries\r\nActa Phys Pol2003\r\nB34\r\n2491\r\n\r\n'},
		{
			ref: '\r\n\r\nXu\r\nF RWalker\r\nP MWyss\r\nR\r\nOblate stability ofA≈110 nuclei\r\nnear ther-process pathPhys Rev C2002\r\n65\r\n021303(R)\r\n',
			doi: '10.1103/PhysRevC.65.021303 '
		},
		{
			ref: '\r\n\r\nShi\r\nYWalker\r\nP MXu\r\nF R\r\nHigh-K isomers in neutron-rich zirconium\r\nisotopesPhys Rev C2012\r\n85\r\n027307\r\n',
			doi: '10.1103/PhysRevC.85.027307 '
		},
		{
			ref: '\r\n\r\nHara\r\nKSun\r\nY\r\nProjected shell model and high-spin spectroscopy\r\nInt J Mod Phys E1995\r\n4\r\n637\r\n785',
			doi: '10.1142/S0218301395000250 '
		},
		{
			ref: '\r\n\r\nYang\r\nY CSun\r\nYZhu\r\nS J et al\r\nTwo-quasiparticleK-isomeric states\r\nin strongly deformed neutron-rich Nd and Sm isotopes: A projected\r\nshell-model analysisJ Phys G-Nucl Part Phys2010\r\n37\r\n085110\r\n',
			doi: '10.1088/0954-3899/37/8/085110 '
		},
		{
			ref: '\r\n\r\nLiu\r\nY XSun\r\nYZhou\r\nX H et al\r\nA systematical study of neutron- rich Zr isotopes by\r\nthe projected shell modelNucl Phys A2011\r\n858\r\n11\r\n31',
			doi: '10.1016/j.nuclphysa.2011.03.010 '
		},
		{
			ref: '\r\n\r\nSun\r\nYZhang\r\nJ YLong\r\nG L et al\r\nCoexistence of normal, super-, and hyper-deformation\r\nin nuclei: A study with angular momentum projection method\r\nChin Sci Bull2009\r\n54\r\n358\r\n363',
			doi: '10.1007/s11434-009-0031-8 '
		},
		{
			ref: '\r\n\r\nZhou\r\nZ YLiu\r\nY XYang\r\nY C et al\r\nDescription of rotational properties of the superheavy\r\nnucleus256,258,260Rf by projected shell model\r\nChin Sci Bull2014\r\n59\r\n3853\r\n3857',
			doi: '10.1007/s11434-014-0574-1 '
		},
		{
			ref: '\r\n\r\nMöller\r\nPSierk\r\nA JBengtsson\r\nR et al\r\nNuclear shape isomersAtom Data Nucl Data Tables2012\r\n98\r\n149\r\n300',
			doi: '10.1016/j.adt.2010.09.002 '
		},
		{
			ref: '\r\n\r\nBengtsson\r\nTRagnarsson\r\nI\r\nRotational bands and particle-hole excitations at very\r\nhigh spinNucl Phys A1985\r\n436\r\n14\r\n82',
			doi: '10.1016/0375-9474(85)90541-X '
		},
		{
			ref: '\r\n\r\nKameda\r\nDKubo\r\nTOhnishi\r\nT et al\r\nObservation of new microsecond isomers among fission\r\nproducts from in-flight fission of 345 MeV/nucleon238U\r\nPhys Rev C2012\r\n86\r\n054319\r\n',
			doi: '10.1103/PhysRevC.86.054319 '
		},
		{
			ref: '\r\n\r\nYeoh\r\nE YZhu\r\nS JHamilton\r\nJ H et al\r\nIdentification of a quasiparticle band in very neutron-rich104ZrPhys Rev C2010\r\n82\r\n027302\r\n',
			doi: '10.1103/PhysRevC.82.027302 '
		},
		{
			ref: '\r\n\r\nLi\r\nKHamilton\r\nJ HRamayya\r\nA V et al\r\nIdentification of new collective bands in neutron-rich102ZrPhys Rev C2008\r\n78\r\n044317\r\n',
			doi: '10.1103/PhysRevC.78.044317 '
		},
		{ref: '\r\n\r\nKumar\r\nBSingh\r\nS KPatra\r\nS K\r\nShape coexistence and parity doublet in Zr isotopes\r\nInt J Mod Phys E2015\r\n24\r\n1550017\r\n\r\n'},
		{
			ref: '\r\n\r\nShen\r\nJ JShen\r\nC W\r\nTheoretical analysis of mass distribution of quasifission\r\nfor238U-induced reactionsSci China-Phys Mech Astron2014\r\n57\r\n453\r\n457',
			doi: '10.1007/s11433-014-5392-6 '
		},
		{
			ref: '\r\n\r\nLi\r\nH TRen\r\nZ Z\r\nShell model calculations for the allowed Gamow- Teller\r\nbeta-decays of light nucleiSci China-Phys Mech Astron2014\r\n57\r\n1005\r\n1012',
			doi: '10.1007/s11433-014-5456-7 '
		},
		{
			ref: '\r\n\r\nZhang\r\nD LDing\r\nB G\r\nDescription of the properties of the low-lying energy\r\nstates in100Mo with IBM2Sci China-Phys Mech Astron2014\r\n57\r\n447\r\n452',
			doi: '10.1007/s11433-014-5394-4 '
		}],
	sections     : [
		{
		label: undefined,
		title: '1<x/>  Introduction',
		body : [Object]
	},
		{
			label: undefined,
			title: '2<x/>  The theoretical model',
			body : [Object]
		},
		{
			label   : undefined,
			title   : '3<x/>  Calculations and discussion',
			body    : [Object],
			sections: [Object]
		},
		{label: undefined, title: '4<x/>  Summary', body: [Object]}],
	abstract     : '\r\n<p>Inspired by the recent experimental identification of the new isomer\r\nwith a half-life of (620±150) ns in the very neutron-rich nucleus <sup>108</sup>Zr, we apply the projected shell model with axially-deformed\r\nbases to discuss possible shapes near the ground state and the nature\r\nof the isomer. The structure of the new isomer is investigated by\r\nrestricting the calculation to prolate and oblate shapes. It is shown\r\nthat the isomer can be understood as a <i>K</i>-isomer.\r\nMeanwhile, the calculation predicts more low-lying high-<i>K</i> configurations, which may be confirmed by future experiments. </p>\r\n',
	figures      : [
		{
		id      : 'FIG13921981055350',
		label   : 'Figure 1',
		caption : '<p>  (Color online) Experimental moments of inertia for <sup> 102–108</sup>Zr even-even isotopes. The data are taken from refs. <xref rid="REF13921981055354">[5,29–31]</xref>.</p>',
		graphics: [Object]
	},
		{
			id      : 'FIG13921981055351',
			label   : 'Figure 2',
			caption : '<p>  (Color online) The Nilsson diagram for (a) protons and (b) neutrons.\r\nSolid curves denote the positive parity states while dashed curves\r\nare for the negative parity states.</p>',
			graphics: [Object]
		},
		{
			id      : 'FIG13921981055352',
			label   : 'Figure 3',
			caption : '<p>  (Color online) Moments of inertia for  <sup>108</sup>Zr calculated\r\nby assuming prolate and oblate shape and comparison with experiment\r\nif data are available <xref rid="REF13921981055354">[5,29]</xref>.</p>',
			graphics: [Object]
		},
		{
			id      : 'FIG13921981055353',
			label   : 'Figure 4',
			caption : '<p>  (Color online) Band diagram for  <sup>108</sup>Zr by assuming\r\na prolate shape with <x content-type="symbolitalic">e</x><sub>2</sub>=+0.335 in (a) and an oblate shape with <x content-type="symbolitalic">e</x><sub>2</sub>=<x content-type="symbol">-</x>0.215 in (b).</p>',
			graphics: [Object]
		},
		{
			id      : 'FIG13921981055354',
			label   : 'Figure 5',
			caption : '<p>  (Color online) Calculated energy levels (solid line) for  <sup>108</sup>Zr and comparison with the available data (dot) by assuming\r\na prolate shape with <x content-type="symbolitalic">e</x><sub>2</sub>=+0.335 <xref rid="REF13921981055354">[5,29]</xref>.</p>',
			graphics: [Object]
		},
		{
			id      : 'FIG13921981055355',
			label   : 'Figure 6',
			caption : '<p>  (Color online) Calculated energy levels (solid line) for  <sup>108</sup>Zr and comparison with the available data (dot) by assuming\r\na prolate shape with <x content-type="symbolitalic">e</x><sub>2</sub>= <x content-type="symbol">-</x>0.215 <xref rid="REF13921981055354">[5,29]</xref>.</p>',
			graphics: [Object]
		}],
	authors      : [{emailRef: '', given: [Object], surname: [Object], fullname: {}},
		{emailRef: '', given: [Object], surname: [Object], fullname: {}},
		{emailRef: '', given: [Object], surname: [Object], fullname: {}}],
	authorNotes  : [{label: '*', email: 'sunyang@sjtu.edu.cn'}],
	affiliations : [{affText: [Object]}],
	accepted     : "Tue Sep 01 2015 00:00:00 GMT+0000 (UTC)",
	tables       : null,
	pubStatus    : 'normal'
}