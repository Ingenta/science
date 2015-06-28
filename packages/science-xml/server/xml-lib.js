ScienceXML = {};
ScienceXML.getLocationAsync = function (path, cb) {
    cb && cb(null, HTTP.get(path).content);
}

ScienceXML.getXmlFromPath = function (path) {
    var getLocationSync = Meteor.wrapAsync(ScienceXML.getLocationAsync);
    //remove first / from path because meteor absolute url includes it absoluteurl = 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
    if (path === undefined)return;
    var fullPath = Meteor.absoluteUrl(path.substring(1));
    return getLocationSync(fullPath);
}

ScienceXML.getSubSection = function (subSectionNodes) {
    var thisSubSection = [];
    subSectionNodes.forEach(function (subSection) {
        thisSubSection.push(ScienceXML.getOneSectionHtml(subSection));
    });
    return thisSubSection;
}

ScienceXML.getOneSectionHtml = function (section) {
    var tempBody = [];
    var title = xpath.select("child::title/descendant::text()", section)[0].data;
    var label = xpath.select("child::label/descendant::text()", section)[0].data;
    var paragraphNodes = xpath.select("child::p", section);
    paragraphNodes.forEach(function (paragraph) {
        tempBody.push(new serializer().serializeToString(paragraph));
    });
    return {label: label, title: title, body: tempBody};
}

ScienceXML.getAbstract = function (results, doc) {
    if (!results.errors)
        results.errors = [];
    var abstract = ScienceXML.getValueByXPathIncludingXml("//abstract", doc)
    if (!abstract)  results.errors.push("No abstract found");
    else {
        abstract = Science.replaceSubstrings(abstract, "<italic>", "<i>");
        abstract = Science.replaceSubstrings(abstract, "</italic>", "</i>");
        results.abstract = abstract;
    }
    return results;
}

ScienceXML.getSimpleValueByXPath = function (xp, doc) {
    var titleNodes = xpath.select(xp, doc)[0];
    if (!titleNodes)return;
    return titleNodes.firstChild.data;
}

ScienceXML.getValueByXPathIgnoringXml = function (xp, doc) {
    var nodes = xpath.select(xp + "/descendant::text()", doc);
    var text = "";
    nodes.forEach(function (part) {
        text += part.data;
    });
    return text;
}

ScienceXML.getValueByXPathIncludingXml = function (xp, doc) {
    var nodes = xpath.select(xp, doc)[0];
    var text = new serializer().serializeToString(nodes);
    //trim parent tags
    var firstTagLength = text.indexOf(">") + 1;
    text = text.substr(firstTagLength);
    text = text.substr(0, text.lastIndexOf("<"));
    return text;
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