ScienceXML = {};
ScienceXML.FileExists = function (path) {
    if (!path)return false;
    if (FSE.existsSync(path)) {
        return true;
    }
    return false;
}
ScienceXML.FolderExists = function (path) {
    if (!path)return false;
    if (FSE.ensureDirSync(path)) {
        return true;
    }
    return false;
}
ScienceXML.RemoveFile = function (path) {
    if (path) {
        FSE.remove(path, function (err) {
            if (err) return console.error(err)
            //console.log('successfully deleted:' + path)
        });
    }
}
ScienceXML.getLocationAsync = function (path, cb) {
    cb && cb(null, HTTP.get(path).content);
}
ScienceXML.getFileContentsFromFullPath = function (path) {
    var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
    //remove first / from path because meteor absolute url includes it absoluteurl =
    // 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
    if (path === undefined)return;
    return getLocationSync(path);
}
ScienceXML.getFileContentsFromRemotePath = function (path) {
    var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
    //remove first / from path because meteor absolute url includes it absoluteurl =
    // 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
    if (!path)return;
    var fullPath = Meteor.absoluteUrl(path.substring(1));
    return getLocationSync(fullPath);
}
ScienceXML.getFileContentsFromLocalPath = function (path) {
    return FSE.readFileSync(path, "utf8");
}

ScienceXML.getAuthorInfo = function (results, doc) {
    results.authors = [];
    results.authorNotes = [];
    var fullName = {};
    var authorNodes = xpath.select("//contrib[@contrib-type='author']", doc);
    authorNodes.forEach(function (author) {
        var surnamePart = {};
        var givenPart = {};
        var fullnamePart ={};
        var emailRef = xpath.select("child::xref[@ref-type='author-note']/text()", author).toString();
        //var authorAffNodes = xpath.select("child::xref[@ref-type='aff']/text()", author);
        //authorAffNodes.forEach(function (aff) {
        //    var rid = xpath.select("attribute::rid", aff)[0];
        //});
        var hasAlternatives = xpath.select("child::name-alternatives", author);
        if (!hasAlternatives || !hasAlternatives.length) {
            var surname = xpath.select("child::name/surname/text()", author).toString();
            var given = xpath.select("child::name/given-names/text()", author).toString();
            surnamePart = {en: surname, cn: surname};
            givenPart = {en: given, cn: given};
        }
        else {
            var surnameEn = xpath.select("child::name-alternatives/name[@lang='en']/surname/text()", author).toString();
            var givenEn = xpath.select("child::name-alternatives/name[@lang='en']/given-names/text()", author).toString();
            var surnameCn = xpath.select("child::name-alternatives/name[@lang='zh-Hans']/surname/text()", author).toString();
            var givenCn = xpath.select("child::name-alternatives/name[@lang='zh-Hans']/given-names/text()", author).toString();
            var fullnameEn = givenEn + " " + surnameEn;
            var fullnameCn = surnameCn+givenCn;
            surnamePart = {en: surnameEn, cn: surnameCn};
            givenPart = {en: givenEn, cn: givenCn};
            fullnamePart = {en:fullnameEn,cn:fullnameCn};

        }

        fullName = {emailRef: emailRef, given: givenPart, surname: surnamePart,fullname:fullnamePart};


        results.authors.push(fullName);
    });
    if (results.authors.length === 0) {
        results.errors.push("No author found");
    }

    var authorNotesNodes = xpath.select("//author-notes/fn[@id]", doc);
    authorNotesNodes.forEach(function (note) {
        var noteLabel = xpath.select("child::label/text()", note).toString();
        var email = xpath.select("descendant::ext-link/text()", note).toString();
        if (noteLabel === undefined) {
            results.errors.push("No noteLabel found");
        } else if (email === undefined) {
            results.errors.push("No email found");
        } else {
            var entry = {label: noteLabel, email: email};
            results.authorNotes.push(entry);
        }
    });
    results.affiliations = [];
    var hasAlternatives = xpath.select("//contrib-group/aff-alternatives", doc);
    if (!hasAlternatives || !hasAlternatives.length) {
        var affText = ScienceXML.getValueByXPathIgnoringXml("//contrib-group/aff/label", doc);
        if(!affText)affText = ScienceXML.getValueByXPathIgnoringXml("//contrib-group/aff", doc);
        if (affText)results.affiliations.push({affText:{en: affText, cn: affText}});
    } else {
        var affNode = xpath.select("//contrib-group/aff-alternatives", doc);
        if (affNode !== undefined) {
            affNode.forEach(function (affiliation) {
                var affTextEn = ScienceXML.getValueByXPathIgnoringXml("child::aff[@lang='en']", affiliation);
                var affTextCn = ScienceXML.getValueByXPathIgnoringXml("child::aff[@lang='zh-Hans']", affiliation);
                var id = xpath.select("attribute::id", affiliation)[0];
                //if one doesn't exist copy the other one.
                var oneAffiliation = {};
                if (!affTextCn)affTextCn = affTextEn;
                if (!affTextEn)affTextEn = affTextCn;

                if (!id) oneAffiliation = {affText:{en: affTextEn, cn: affTextCn}};
                else oneAffiliation = {id: id.value, affText:{en: affTextEn, cn: affTextCn}};
                results.affiliations.push(oneAffiliation);
            });
        }
    }
    return results;
}

ScienceXML.getSubSection = function (subSectionNodes) {
    var thisSubSection = [];
    subSectionNodes.forEach(function (subSection) {
        var thisSection = ScienceXML.getOneSectionHtmlFromSectionNode(subSection);
        var childSectionNodes = xpath.select("child::sec", subSection);
        if (!childSectionNodes.length)thisSubSection.push(thisSection);
        else {
	        var subSecs = ScienceXML.getSubSection(childSectionNodes);
	        var figures=[];
	        if(!_.isEmpty(subSecs)){
		        var figures=[];
		        for(var i=0;i<subSecs.length;i++){
			        if(!_.isEmpty(subSecs[i].body.figures)){
				        figures= _.union(figures,subSecs[i].body.figures);
				        delete subSecs[i].body.figures;
			        }
		        }
                thisSection.body.figures=figures
	        }
            thisSubSection.push({
                label: thisSection.label,
                title: thisSection.title,
                body: thisSection.body,
                sections: subSecs
            });
        }
    });
    return thisSubSection;
}

var getParagraphs = function (paragraphNodes) {
	var paragraphs = {html: "", tex: [], figures:[]};
	paragraphNodes.forEach(function (paragraph) {
		if(paragraph.tagName==='fig'){
			//兼容中国科学插图数据处理
			var fig = getFigure(paragraph);
			if(fig){
				paragraphs.figures.push(fig);
				var ref = '<p><xref ref-type="fig" rid="'+fig.id+'">'+fig.label+'</xref></p>';
				paragraphs.html+=ref;
			}
		}else{
			var parseResult = ScienceXML.handlePara(paragraph);
			var sectionText = new serializer().serializeToString(parseResult.paraNode);
			paragraphs.html += ScienceXML.replaceItalics(sectionText);
			if (parseResult.formulas && parseResult.formulas.length) {
				paragraphs.tex = _.union(paragraphs.tex, parseResult.formulas);
			}
		}
	});
	return paragraphs;
}

ScienceXML.getParagraphsFromASectionNode = function (section) {
    var paragraphNodes = xpath.select("child::p | child::fig", section);
    //var paragraphNodes = xpath.select("child::p", section);
    return getParagraphs(paragraphNodes);
};

ScienceXML.getOneSectionHtmlFromSectionNode = function (section) {
    var title = ScienceXML.getValueByXPathIncludingXml("child::title", section);
    var label = ScienceXML.getValueByXPathIncludingXml("child::label", section);
    var paragraphs = ScienceXML.getParagraphsFromASectionNode(section);
    return {label: label, title: title, body: paragraphs};
};

ScienceXML.getFullText = function (results, doc) {
	// 先检查body下是否有不包含在sec节点中的p节点，如果有的话，
	// 将这些p节点提取出来作为一个新的章节放到章节列表的顶部
	var ghostSec, normalSecs = [];
	var pUnderBody           = xpath.select("//body/p | //body/fig", doc);
	if (!_.isEmpty(pUnderBody)) {
		var ghostContent = getParagraphs(pUnderBody);
		ghostSec         = ghostContent && {label: undefined, title: "__start__", body: ghostContent};
	}
	// 取出body下的正常章节信息
	var sectionNodes = xpath.select("//body/sec", doc);
	if (!_.isEmpty(sectionNodes)) {
		//调用递归方法按层级关系取得所有章节信息
		normalSecs = ScienceXML.getSubSection(sectionNodes);
	}
	// 若开头存在无sec内容，合并
	if (ghostSec) {
		normalSecs = _.union(ghostSec, normalSecs);
	}
	// 兼容中国科学插图
	// 将文内插图取出统一放到文章的figures节点中
	if(!_.isEmpty(normalSecs)){
		var figures=[];
		for(var i=0;i<normalSecs.length;i++){
			if(!_.isEmpty(normalSecs[i].body.figures)){
				figures= _.union(figures,normalSecs[i].body.figures);
				delete normalSecs[i].body.figures;
			}
		}
		results.figures=figures;
	}

	results.sections=normalSecs;
	return results;
};

ScienceXML.getAbstract = function (results, doc) {
    if (!results.errors) results.errors = [];
    var abstract = ScienceXML.getValueByXPathIncludingXml("//abstract", doc);
    if (!abstract)  results.errors.push("No abstract found");
    else results.abstract = abstract;
    return results;
};

ScienceXML.getContentType = function (results, doc) {
    if (!results.errors) results.errors = [];
    var contentType = xpath.select("//article/@article-type", doc);
    if (contentType[0].value === undefined) results.errors.push("No content type found");
    else results.contentType = contentType[0].value.trim().toLowerCase();
    return results;
}

ScienceXML.replaceItalics = function (input) {
    input = Science.replaceSubstrings(input, "<italic>", "<i>");
    input = Science.replaceSubstrings(input, "</italic>", "</i>");
    return input;
}

ScienceXML.replaceNewLines = function (input) {
    input = Science.replaceSubstrings(input, "/n", " ");
    return input;
}

ScienceXML.getSimpleValueByXPath = function (xp, doc) {
    var titleNodes = xpath.select(xp, doc)[0];
    if (!titleNodes)return;
    return titleNodes.firstChild.data;
}

ScienceXML.getValueByXPathIgnoringXml = function (xp, doc) {
    var nodes = xpath.select(xp + "/descendant::text()", doc);
    if (nodes === undefined)return;
    var text = "";
    nodes.forEach(function (part) {
        text += part.data;
    });
    return text;
}

ScienceXML.getValueByXPathIncludingXml = function (xp, doc) {
    var nodes = xpath.select(xp, doc)[0];
    if (nodes === undefined)return;
    var text = new serializer().serializeToString(nodes);
    //trim parent tags
    var firstTagLength = text.indexOf(">") + 1;
    text = text.substr(firstTagLength);
    text = text.substr(0, text.lastIndexOf("<"));
    return ScienceXML.replaceItalics(text);
}

ScienceXML.xmlStringToXmlDoc = function (xml) {
    return new dom().parseFromString(xml);
}
ScienceXML.validateXml = function (xml) {
    var xmlErrors = [];
    var xmlDom = new dom({
        errorHandler: function (msg) {
            xmlErrors.push(msg);
        }
    });
    var doc = xmlDom.parseFromString(xml);
    return xmlErrors;
}


ScienceXML.getDateFromHistory = function (type, doc) {
    var day = ScienceXML.getValueByXPathIncludingXml("//history/date[@date-type='" + type + "']/day", doc);
    var month = ScienceXML.getValueByXPathIncludingXml("//history/date[@date-type='" + type + "']/month", doc);
    var year = ScienceXML.getValueByXPathIncludingXml("//history/date[@date-type='" + type + "']/year", doc);
    if (!day || !month || !year)return;
    return new Date(Date.parse(year + '/ ' + month + '/' + day));
};

var getFigure = function(fig){
	var figure = {};
	var id = xpath.select("./@id", fig);
	if (id && id.length) {
		figure.id = id[0].value;
	}
	var position = xpath.select("./@position", fig);
	if (position && position.length) {
		figure.position = position[0].value;
	}

	var label = xpath.select("child::label/text()", fig);
	if (!label || !label.length) {
		label = xpath.select("child::caption/title/text()",fig);//兼容中国科学的数据
	}
	if (label && label.length) {
		figure.label = label[0].toString();
	}

	var caption = xpath.select("child::caption/p", fig);
	if (caption && caption.length) {
		figure.caption = caption[0].toString();
	}
    //中国科学数据中无此项
	//var graphicLinks = xpath.select("child::graphic", fig);
	//if (graphicLinks && graphicLinks.length) {
	//	figure.links = [];
	//	graphicLinks.forEach(function (gl) {
	//		var glId = xpath.select("./@id", gl);
	//		if (glId && glId.length) {
	//			figure.links.push(glId[0].value);
	//		}
	//	})
	//}

	var graphics = xpath.select("descendant::graphic", fig);
	if (graphics && graphics.length) {
		figure.graphics = [];
		//var xlinkSelect = xpath.useNamespaces({"xlink":
		// "http://www.w3.org/1999/xlink"});//新的xml模板中去掉了xlink命名空间，不再需要
		graphics.forEach(function (grap) {
			var g = {};
			var suse = xpath.select("./@specific-use", grap);
			if (suse && suse.length) {
				g.use = suse[0].value;
			}
			var href = xpath.select('@href', grap);
			if (href && href.length) {
				g.href = href[0].value && href[0].value.replace('\\','/');//兼容windows的分隔符\
			}
			figure.graphics.push(g);
		})
	}
	return figure;
};

ScienceXML.getFigures = function (doc) {
    var figNodes = xpath.select("//floats-group/fig", doc);
    if (figNodes && figNodes.length) {
        var figures = [];
        figNodes.forEach(function (fig) {
            var figure = getFigure(fig);
	        figure && figures.push(figure);
        });
        return figures;
    }
    return null;
};

ScienceXML.getTables = function (doc) {
    var tbNodes = xpath.select("//floats-group/table-wrap", doc);
    if (tbNodes && tbNodes.length) {
        var tables = [];
        tbNodes.forEach(function (tb) {
            var table = {};
            var id = xpath.select("./@id", tb);
            if (id && id.length) {
                table.id = id[0].value;
            }
            var position = xpath.select("./@position", tb);
            if (position && position.length) {
                table.position = position[0].value;
            }
            var label = xpath.select("child::label/text()", tb);
            if (label && label.length) {
                table.label = label[0].toString();
            }
            var caption = xpath.select("child::caption/p/text()", tb);
            if (caption && caption.length) {
                table.caption = caption[0].toString();
            }
            var tableNodes = xpath.select("child::table", tb);
            if (tableNodes && tableNodes.length) {
                table.table = tableNodes[0].toString();
            }
            tables.push(table);
        });
        return tables;
    }
    return null;
};

ScienceXML.handlePara = function (paragraph) {
    var handled = {paraNode: paragraph};

    var formulaNodes = xpath.select("descendant::disp-formula | descendant::inline-formula", paragraph);
    if (formulaNodes && formulaNodes.length) {
        handled.formulas = [];
        formulaNodes.forEach(function (fnode) {
            var formula = {};
            var id = xpath.select("./@id", fnode);
            if (id && id.length) {
                formula.id = id[0].value;
            }
            var label = xpath.select("child::label", fnode);
            if (label && label.length) {
                formula.label = label[0].textContent;
            }
            var tex = xpath.select("child::alternatives/tex-math", fnode);
            if (tex && tex.length) {
                if (tex[0].childNodes[2] && tex[0].childNodes[2].nodeName == '#cdata-section') {
                    formula.tex = tex[0].childNodes[2].data;
                }

            }
            var mmlSelect = xpath.useNamespaces({"mml": "http://www.w3.org/1998/Math/MathML"});
            var mathml = mmlSelect('descendant::mml:math', fnode);
            if (mathml && mathml.length) {
                formula.mathml = mathml[0].toString().replace(/<mml:/g, '<').replace(/<\/mml:/g, '</');
            }
            handled.formulas.push(formula);
            while (fnode.firstChild)
                fnode.removeChild(fnode.firstChild);

            if (formula.mathml) {
                var nd = ScienceXML.xmlStringToXmlDoc(formula.mathml);
                fnode.appendChild(nd.documentElement);
            } else if (formula.tex) {
                fnode.appendChild(ScienceXML.xmlStringToXmlDoc("<p>" + formula.tex + "</p>").documentElement);
            }

        });
    }

    return handled;

};


ScienceXML.getKeywords= function(xp,dom){
    var keywords = xpath.select(xp, dom);
    var allkeywords = [];
    if(keywords && keywords.length){
        _.each(keywords,function(kw){
            var skw=kw.toString().split(/\s*[,，]\s*/);
            allkeywords=_.union(allkeywords,skw);

        })
    }
    return _.uniq(allkeywords);
}