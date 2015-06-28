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
    var tempBody = "";
    var title = ScienceXML.getValueByXPathIncludingXml("child::title", section);
    var label = ScienceXML.getValueByXPathIncludingXml("child::label", section);
    var paragraphNodes = xpath.select("child::p", section);
    paragraphNodes.forEach(function (paragraph) {
        var sectionText = new serializer().serializeToString(paragraph)
        tempBody += ScienceXML.replaceItalics(sectionText);
    });
    return {label: label, title: title, body: tempBody};
}

ScienceXML.getFullText = function (results, doc) {
    var sectionNodes = xpath.select("//body/sec[@id]", doc); //get all parent sections
    sectionNodes.forEach(function (section) {
        var childSectionNodes = xpath.select("child::sec[@id]", section);
        if (childSectionNodes.length) {
            var thisSection = ScienceXML.getOneSectionHtml(section);
            results.sections.push({
                label: thisSection.label,
                title: thisSection.title,
                body: thisSection.body,
                sections: ScienceXML.getSubSection(childSectionNodes)
            });
        }
        else
            results.sections.push(ScienceXML.getOneSectionHtml(section));
    });
    return results;
}

ScienceXML.getAbstract = function (results, doc) {
    if (!results.errors) results.errors = [];
    var abstract = ScienceXML.getValueByXPathIncludingXml("//abstract", doc)
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