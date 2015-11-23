var parserHelper = Science.XPath.ParseHelper;

ScienceXML = {};
ScienceXML.FileExists = function (path) {
    if (!path)return false;
    if (Science.FSE.existsSync(path)) {
        return true;
    }
    return false;
}
ScienceXML.FolderExists = function (path) {
    if (!path)return false;
    if (Science.FSE.ensureDirSync(path)) {
        return true;
    }
    return false;
}
ScienceXML.RemoveFile = function (path) {
    if (path) {
        Science.FSE.remove(path, function (err) {
            if (err) return console.error(err)
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
    return Science.FSE.readFileSync(path, "utf8");
}

ScienceXML.getAuthorInfo = function (results, doc) {
    results.authors = [];
    results.authorNotes = [];
    results.affiliations = [];
    var authorNodes = parserHelper.getNodes("//contrib[@contrib-type='author']", doc);
    _.each(authorNodes, function (author) {
        var fullnamePart = {};

        var surnamePart = parserHelper.getMultiVal("descendant::name[@lang='{lang}']/surname", author, {planb: "descendant::name/surname"});
        var givenPart = parserHelper.getMultiVal("descendant::name[@lang='{lang}']/given-names", author, {planb: "descendant::name/given-names"});
        fullnamePart.en = surnamePart.en + " " + givenPart.en;
        fullnamePart.cn = surnamePart.cn + " " + givenPart.cn;

        var authorObj = {given: givenPart, surname: surnamePart, fullname: fullnamePart};

        //通讯作者信息
        var noteAttr = parserHelper.getFirstAttribute("child::xref[@ref-type='author-note']/attribute::rid | child::xref[@ref-type='Corresp']/attribute::rid", author);
        if (noteAttr) {
            authorObj.email = noteAttr;
            logger.info('parse email done')
        }

        //工作单位信息
        var affAttrs = parserHelper.getAttributes("child::xref[@ref-type='aff']/attribute::rid", author);
        if (!_.isEmpty(affAttrs)) {
            authorObj.affs = _.uniq(affAttrs);
        }

        results.authors.push(authorObj);
    });
    if (_.isEmpty(results.authors)) {
        results.errors.push("No author found");
    }

    var authorNotesNodes = parserHelper.getNodes("//author-notes/fn[@id]", doc);
    authorNotesNodes.forEach(function (note) {
        var noteLabel = parserHelper.getSimpleVal("child::label", note);
        var email = parserHelper.getSimpleVal("descendant::ext-link", note);
        var multiLangNote = parserHelper.getMultiVal("child::p[@lang='{lang}']", note, {
            planb: "child::p",
            handler: parserHelper.handler.xml
        });

        var id = parserHelper.getFirstAttribute("attribute::id", note);
        if (noteLabel === undefined) {
            results.errors.push("No noteLabel found");
        } else if (email === undefined) {
            results.errors.push("No email found");
        } else {
            var entry = {id: id, label: noteLabel, email: email};
            if (!_.isEmpty(multiLangNote)) {
                entry.note = {};
                _.each(multiLangNote, function (noteContent, key) {
                    var mailTag = "<a href=\"mailto:<m>\"><m></a>".replace(/<m>/g, email);
                    noteContent = noteContent.toString().trim().replace(/<ext-link[^<]+<\/ext-link>/, mailTag);
                    noteContent = noteContent.replace(/<\/?p[^>]*>/g, "");
                    entry.note[key] = noteContent;
                })
            }
            results.authorNotes.push(entry);
        }
    });

    var affNodes = parserHelper.getNodes("//contrib-group/aff-alternatives", doc);
    if (_.isEmpty(affNodes)) {
        affNodes = parserHelper.getNodes("//contrib-group/aff", doc);
        _.each(affNodes, function (affNode) {
            var affiliation = {id: undefined, affText: {}};
            affiliation.id = parserHelper.getFirstAttribute("attribute::id", affNode);
            affiliation.label = parserHelper.getSimpleVal("child::label[1]", affNode);
            affiliation.affText.en = parserHelper.getSimpleVal("child::label[last()]", affNode);
            results.affiliations.push(affiliation);
        })
    } else {
        var index = 1;
        _.each(affNodes, function (affNode) {
            var affiliation = {id: undefined, affText: {}};
            affiliation.id = parserHelper.getFirstAttribute("attribute::id", affNode);
            affiliation.label = parserHelper.getMultiVal("child::aff[@lang='{lang}']/label[1]", affNode);

            // -------临时逻辑 开始--------
            // 若取到了中文标签但是没取到英文标签,用序号做英文标签.
            // 待中国科学方正确调整了affiliation数据,测试通过后应当删除这段代码
            if ((affiliation.label.cn && !affiliation.label.en) || (!affiliation.label.en || affiliation.label.en.length > 2)) {
                affiliation.label.en = String(index);
            }
            index++;
            // -------临时逻辑 结束----------

            affiliation.affText = parserHelper.getMultiVal("child::aff[@lang='{lang}']/label[last()]", affNode);
            results.affiliations.push(affiliation);
        });
    }
    logger.info('parse author done');
    return results;
}

ScienceXML.getSubSection = function (subSectionNodes) {
    var thisSubSection = [];
    subSectionNodes.forEach(function (subSection) {
        var thisSection = ScienceXML.getOneSectionHtmlFromSectionNode(subSection);
        var childSectionNodes = xpath.select("child::sec", subSection);
        if (_.isEmpty(childSectionNodes))thisSubSection.push(thisSection);
        else {
            var subSecs = ScienceXML.getSubSection(childSectionNodes);
            var figures = [];
            if (!_.isEmpty(subSecs)) {
                var figures = [];
                for (var i = 0; i < subSecs.length; i++) {
                    if (!_.isEmpty(subSecs[i].body.figures)) {
                        figures = _.union(figures, subSecs[i].body.figures);
                        delete subSecs[i].body.figures;
                    }
                }
                thisSection.body.figures = figures
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
    var paragraphs = {html: "", tex: [], figures: []};
    paragraphNodes.forEach(function (paragraph) {
        if (paragraph.tagName === 'fig') {
            //兼容中国科学插图数据处理
            var fig = getFigure(paragraph);
            if (fig) {
                paragraphs.figures.push(fig);
                var ref = '<p style="display:none"><xref original="true" ref-type="fig" rid="' + fig.id + '">' + fig.label + '</xref></p>';
                paragraphs.html += ref;
            }
        } else {
            var parseResult = ScienceXML.handlePara(paragraph);
            var sectionText = new serializer().serializeToString(parseResult.paraNode);
            paragraphs.html += ScienceXML.replaceItalics(ScienceXML.replaceNewLines(sectionText));

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
    var pUnderBody = xpath.select("//body/p | //body/fig", doc);
    if (!_.isEmpty(pUnderBody)) {
        var ghostContent = getParagraphs(pUnderBody);
        ghostSec = ghostContent && {label: undefined, title: "__start__", body: ghostContent};
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
    if (!_.isEmpty(normalSecs)) {
        var figures = [];
        for (var i = 0; i < normalSecs.length; i++) {
            if (!_.isEmpty(normalSecs[i].body.figures)) {
                figures = _.union(figures, normalSecs[i].body.figures);
                delete normalSecs[i].body.figures;
            }
        }
        results.figures = figures;
    }

    results.sections = normalSecs;
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
    var contentType = parserHelper.getFirstAttribute("//article/@article-type", doc);
    if (!contentType) {
        contentType = parserHelper.getSimpleVal("//article-meta/article-type", doc);
    }
    if (contentType) {
        contentType = contentType.trim().toLowerCase();
        var trans = _.contains(Config.parser.contentTypeDic.article, contentType) ? "article" : "other";
        results.contentType = trans;
    } else {
        results.errors.push("No content type found");
    }
    return results;
}

ScienceXML.replaceItalics = function (input) {
    input = Science.replaceSubstrings(input, "<italic>", "<i>");
    input = Science.replaceSubstrings(input, "</italic>", "</i>");
    return input;
}

ScienceXML.replaceNewLines = function (input) {
    input = Science.replaceSubstrings(input, "\r\n", " ");
    input = Science.replaceSubstrings(input, "\n", " ");
    return input;
}

ScienceXML.getSimpleValueByXPath = function (xp, doc) {
    var titleNodes = xpath.select(xp, doc);
    if (_.isEmpty(titleNodes))return;
    if (!titleNodes[0].firstChild) return;
    var text = titleNodes[0].firstChild.data;
    return ScienceXML.replaceNewLines(text);
}

ScienceXML.getValueByXPathIgnoringXml = function (xp, doc) {
    var nodes = xpath.select(xp + "/descendant::text()", doc);
    if (nodes === undefined)return;
    var text = "";
    nodes.forEach(function (part) {
        text += part.data;
    });
    return ScienceXML.replaceNewLines(text);
}

ScienceXML.getValueByXPathIncludingXml = function (xp, doc) {
    var nodes = xpath.select(xp, doc)[0];
    if (nodes === undefined)return;
    var text = new serializer().serializeToString(nodes);
    //trim parent tags
    var firstTagLength = text.indexOf(">") + 1;
    text = text.substr(firstTagLength);
    text = text.substr(0, text.lastIndexOf("<"));
    text = ScienceXML.replaceItalics(text);
    return ScienceXML.replaceNewLines(text);
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


ScienceXML.getDateFromHistory = function (types, doc) {
    var result;
    _.each(types, function (type) {
        var day = ScienceXML.getValueByXPathIncludingXml("//history/date[@date-type='" + type + "']/day", doc);
        var month = ScienceXML.getValueByXPathIncludingXml("//history/date[@date-type='" + type + "']/month", doc);
        var year = ScienceXML.getValueByXPathIncludingXml("//history/date[@date-type='" + type + "']/year", doc);
        if (day && month && year) {
            result = new Date(Date.parse(year + '/ ' + month + '/' + day));
            return;
        }
    })
    return result;
};

var getFigure = function (fig) {
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
        var labelNode = xpath.select("child::caption/title", fig);//兼容中国科学的数据 T-T
        if (!_.isEmpty(labelNode)) {
            var textNodes = xpath.select("descendant::text()", labelNode[0]);
            if (!_.isEmpty(textNodes)) {
                var l = _.pluck(textNodes, "data").join(" ").trim();
                if (l)
                    label = [l];
            }
        }
    }
    if (label && label.length) {
        figure.label = label[0].toString();
    }

    var caption = xpath.select("child::caption/p", fig);
    if (caption && caption.length) {
        figure.caption = caption[0].toString().replace(/<mml:/g, '<').replace(/<\/mml:/g, '</');
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
                g.href = href[0].value && href[0].value.replace('\\', '/');//兼容windows的分隔符\
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


ScienceXML.getKeywords = function (xp, dom) {
    var keywords = xpath.select(xp, dom);
    var allkeywords = [];
    if (keywords && keywords.length) {
        _.each(keywords, function (kw) {
            var skw = kw.toString().split(/\s*[,，]\s*/);
            allkeywords = _.union(allkeywords, skw);

        })
    }
    return _.uniq(allkeywords);
}

ScienceXML.getReferences = function (results, doc) {
    var refs = [];
    var refNodes = parserHelper.getNodes("//back/ref-list/ref", doc);
    var index = 1;
    _.each(refNodes, function (refNode) {
        var ref = {};
        ref.index = index++;
        var ele = parserHelper.getFirstNode("child::element-citation", refNode);
        if (!ele) {
            results.errors.push("can't find element-citation node " + ref.index);
        } else {
            ref.id = parserHelper.getFirstAttribute("attribute::id", ele);
            ref.type = parserHelper.getFirstAttribute("attribute::publication-type", ele);
            //提取引文作者信息 开始
            var authorNodes = parserHelper.getNodes("descendant::person-group/name", refNode);
            if (authorNodes) {
                var authors = [];
                _.each(authorNodes, function (authorNode) {
                    var author = {};
                    author.surName = parserHelper.getSimpleVal("child::surname", authorNode);
                    author.givenName = parserHelper.getSimpleVal("child::given-names", authorNode);
                    authors.push(author);
                });
                //若从引文信息中提取到了作者信息，将作者信息放入引文信息中
                if (!_.isEmpty(authors)) {
                    ref.authors = authors;
                    //检查是否有更多被省略的作者(若存在etal标签，可判定有被省略的作者)
                    if (parserHelper.getFirstNode("descendant::person-group/etal", refNode)) {
                        ref.etal = true;
                    }
                }
            }
            //提取引文作者信息 完成
            ref.title = parserHelper.getXmlString("child::element-citation/article-title", refNode,true);
            ref.title=ref.title && ref.title.replace(/\r\n/g, " ").trim();
            ref.publisherLoc = parserHelper.getSimpleVal("child::element-citation/publisher-loc", refNode);
            ref.publisherName = parserHelper.getSimpleVal("child::element-citation/publisher-name", refNode);
            ref.year = parserHelper.getSimpleVal("child::element-citation/year", refNode);
            ref.volume = parserHelper.getSimpleVal("child::element-citation/volume", refNode);
            ref.issue = parserHelper.getSimpleVal("child::element-citation/issue", refNode);
            ref.firstPage = parserHelper.getSimpleVal("child::element-citation/fpage", refNode);
            ref.lastPage = parserHelper.getSimpleVal("child::element-citation/lpage", refNode);
            ref.doi = parserHelper.getSimpleVal("child::element-citation/pub-id[@pub-id-type='doi']", refNode);
            ref.source = parserHelper.getSimpleVal("child::element-citation/source", refNode) || parserHelper.getSimpleVal("child::element-citation/source/uri", refNode);
            ref.href = parserHelper.getFirstAttribute("child::element-citation/source/uri/@xlink:href", refNode, {"xlink": "http://www.w3.org/1999/xlink"});
            refs.push(ref);
        }
    });
    return refs;
};

ScienceXML.getPACS = function (doc) {
    var pacsNodes = xpath.select("//kwd-group[@kwd-group-type='pacs-codes']/compound-kwd/compound-kwd-part[@content-type='code']/text()", doc);
    if (_.isEmpty(pacsNodes))
        return
    var codes = [];
    _.each(pacsNodes, function (node) {
        var code = node && node.data
        if (code && code.trim()) {
            codes.push(code.trim());
        }
    })
    return codes;
}

ScienceXML.getFunding = function (doc) {
    var fundingNodes = xpath.select("//funding-group/award-group", doc);
    if (_.isEmpty(fundingNodes)) {
        return;
    }
    var fundingObjects = [];
    _.each(fundingNodes, function (fundNode) {
        var funding = {};
        funding.source = ScienceXML.getSimpleValueByXPath("child::funding-source", fundNode);
        funding.contract = ScienceXML.getSimpleValueByXPath("child::award-id[@award-type='contract']", fundNode);
        fundingObjects.push(funding);
    })
    return fundingObjects;
}