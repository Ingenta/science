ScienceXML = {};
ScienceXML.getLocationAsync = function (path, cb) {
    cb && cb(null, HTTP.get(path).content);
}
ScienceXML.getFileContentsFromFullPath = function (path) {
    var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
    //remove first / from path because meteor absolute url includes it absoluteurl = 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
    if (path === undefined)return;
    return getLocationSync(path);
}
ScienceXML.getFileContentsFromPath = function (path) {
    var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
    //remove first / from path because meteor absolute url includes it absoluteurl = 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
    if (path === undefined)return;
    var fullPath = Meteor.absoluteUrl(path.substring(1));
    return getLocationSync(fullPath);
}

ScienceXML.getSubSection = function (subSectionNodes) {
    var thisSubSection = [];
    subSectionNodes.forEach(function (subSection) {
        var thisSection = ScienceXML.getOneSectionHtmlFromSectionNode(subSection);
        var childSectionNodes = xpath.select("child::sec[@id]", subSection);
        if (!childSectionNodes.length)thisSubSection.push(thisSection);
        else {
            thisSubSection.push({
                label: thisSection.label,
                title: thisSection.title,
                body: thisSection.body,
                sections: ScienceXML.getSubSection(childSectionNodes)
            });
        }
    });
    return thisSubSection;
}

ScienceXML.getParagraphsFromASectionNode = function (section) {
    var paragraphNodes = xpath.select("child::p", section);
    var paragraphs = {html:"",tex:[]};
    paragraphNodes.forEach(function (paragraph) {
        var parseResult = ScienceXML.handlePara(paragraph);
        var sectionText = new serializer().serializeToString(parseResult.paraNode);
        paragraphs.html += ScienceXML.replaceItalics(sectionText);
        if(parseResult.formulas && parseResult.formulas.length){
            paragraphs.tex = _.union(paragraphs.tex,parseResult.formulas);
        }
    });
    return paragraphs;
}

ScienceXML.getOneSectionHtmlFromSectionNode = function (section) {
    var title = ScienceXML.getValueByXPathIncludingXml("child::title", section);
    var label = ScienceXML.getValueByXPathIncludingXml("child::label", section);
    var paragraphs = ScienceXML.getParagraphsFromASectionNode(section);
    return {label: label, title: title, body: paragraphs};
};

ScienceXML.getFullText = function (results, doc) {
    var sectionNodes = xpath.select("//body/sec[@id]", doc); //get all parent sections
    results.sections = ScienceXML.getSubSection(sectionNodes);
    return results;
}

ScienceXML.getAbstract = function (results, doc) {
    if (!results.errors) results.errors = [];
    var abstract = ScienceXML.getValueByXPathIncludingXml("//abstract", doc);
    if (!abstract)  results.errors.push("No abstract found");
    else results.abstract = abstract;
    return results;
}


ScienceXML.replaceItalics = function (input) {
    input = Science.replaceSubstrings(input, "<italic>", "<i>");
    input = Science.replaceSubstrings(input, "</italic>", "</i>");
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
    return new Date(Date.parse(year + '/ ' +month + '/'+day));
}

ScienceXML.handlePara = function(paragraph){
    var handled = {paraNode:paragraph};

    //检查是否含有公式
    var formulaNodes = xpath.select("child::disp-formula", paragraph);
    if(formulaNodes && formulaNodes.length){
        handled.formulas = [];
        formulaNodes.forEach(function(fnode){
            var formula = {};
            var id = xpath.select("./@id",fnode);
            if(id && id.length){
                formula.id=id[0].value;
            }
            var label = xpath.select("child::label",fnode);
            if(label && label.length){
                formula.label = label[0].textContent;
            }
            var tex = xpath.select("child::alternatives/tex-math",fnode);
            if(tex && tex.length){
                if(tex[0].childNodes[2].nodeName=='#cdata-section'){
                    formula.tex = tex[0].childNodes[2].data;
                }

            }
            var mmlSelect = xpath.useNamespaces({"mml": "http://www.w3.org/1998/Math/MathML"});
            var mathml =mmlSelect('child::alternatives/mml:math', fnode);
            if(mathml && mathml.length){
                formula.mathml=mathml[0].toString().replace(/<mml:/g,'<').replace(/<\/mml:/g,'</');
            }
            handled.formulas.push(formula);
            while(fnode.firstChild)
                fnode.removeChild(fnode.firstChild);

            if(formula.mathml){
                var nd = ScienceXML.xmlStringToXmlDoc(formula.mathml);
                fnode.appendChild(nd.documentElement);
            }else if(formula.tex){
                fnode.appendChild(ScienceXML.xmlStringToXmlDoc("<p>"+formula.tex + "</p>").documentElement);
            }

        });
    }

    return handled;

};