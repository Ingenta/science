if (Meteor.isServer) {
    ScienceXML = {};
    var getLocationAsync = function (path, cb) {
        cb && cb(null, HTTP.get(path).content);
    }

    var getXmlFromPath = function (path) {
        var getLocationSync = Meteor.wrapAsync(getLocationAsync);
        //remove first / from path because meteor absolute url includes it absoluteurl = 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
        if (path === undefined)return;
        var fullPath = Meteor.absoluteUrl(path.substring(1));
        return getLocationSync(fullPath);
    }

    ScienceXML.getSubSection = function (subSectionNodes, mySerializer) {
        var thisSubSection = [];
        subSectionNodes.forEach(function (subSection) {
            thisSubSection.push(ScienceXML.getOneSectionHtml(subSection, mySerializer));
        });
        return thisSubSection;
    }

    ScienceXML.getOneSectionHtml = function (section, mySerializer) {
        var tempBody = [];
        var title = xpath.select("child::title/descendant::text()", section)[0].data;
        var label = xpath.select("child::label/descendant::text()", section)[0].data;
        var paragraphNodes = xpath.select("child::p", section);
        paragraphNodes.forEach(function (paragraph) {
            tempBody.push(mySerializer.serializeToString(paragraph));
        });
        return {label: label, title: title, body: tempBody};
    }

    ScienceXML.getTitle = function (results, doc) {
        if (!results.errors)
            results.errors = [];
        var title = ScienceXML.getSimpleValueByXPath("//article-title", doc);
        if (title === undefined) results.errors.push("No title found");
        else results.title = title;
        return results;
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
}


Meteor.methods({
    'parseXml': function (path) {
        var results = {};
        results.errors = [];
        results.authors = [];
        results.authorNotes = [];
        results.references = [];
        results.sections = [];

        //Step 1: get the file
        var xml = getXmlFromPath(path);

        //Step 2: Parse the file
        var xmlErrors = [];
        var xmlDom = new dom({
            errorHandler: function (msg) {
                xmlErrors.push(msg);
            }
        });
        var XMLserializer = new serializer({
            errorHandler: function (msg) {
                xmlErrors.push(msg);
            }
        });
        var doc = xmlDom.parseFromString(xml);
        if (xmlErrors.length) {
            for (i = 0; i < xmlErrors.length; i++) {
                results.errors.push(xmlErrors[i]);
            }
            return results;
        }

        var doi = ScienceXML.getSimpleValueByXPath("//article-id[@pub-id-type='doi']", doc);
        if (doi === undefined) results.errors.push("No doi found");
        else results.doi = doi;

        //TODO: if doi is already found then add to articles collection
        var existingArticle = Articles.findOne({doi: results.doi});
        if (existingArticle !== undefined)results.errors.push("Article found matching this DOI: " + results.doi);

        results = ScienceXML.getTitle(results, doc);

        var volume = ScienceXML.getSimpleValueByXPath("//volume", doc);
        if (volume === undefined) results.errors.push("No volume found");
        else results.volume = volume;

        var issue = ScienceXML.getSimpleValueByXPath("//issue", doc);
        if (issue === undefined) results.errors.push("No issue found");
        else results.issue = issue;

        var month = ScienceXML.getSimpleValueByXPath("//pub-date/month", doc);
        if (month === undefined) results.errors.push("No month found");
        else results.month = month;

        var year = ScienceXML.getSimpleValueByXPath("//pub-date/year", doc);
        if (year === undefined) results.errors.push("No year found");
        else results.year = year;

        var elocationId = ScienceXML.getSimpleValueByXPath("//article-meta/elocation-id", doc);
        if (elocationId === undefined) results.errors.push("No elocation id found");
        else results.elocationId = elocationId

        var affNode = xpath.select("//contrib-group/aff/descendant::text()", doc);
        if (affNode[0] !== undefined) {
            results.affiliations = "";
            affNode.forEach(function (affiliation) {
                results.affiliations += affiliation.data;
            });
        }

        var issn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='ppub']", doc);
        if (issn !== undefined) results.issn = issn;

        var essn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='epub']", doc);
        if (essn !== undefined) results.essn = essn;

        var journalTitle = ScienceXML.getSimpleValueByXPath("//journal-title", doc);
        if (journalTitle === undefined) results.errors.push("No journal title found");
        else {
            results.journalTitle = journalTitle;
            var journal = Publications.findOne({title: results.journalTitle});
            if (journal === undefined) results.errors.push("No journal title found in the system with the name: " + results.journalTitle);
            else results.journalId = journal._id;
        }

        var publisherName = ScienceXML.getSimpleValueByXPath("//publisher-name", doc);
        if (publisherName === undefined) results.errors.push("No publisher name found");
        else {
            results.publisherName = publisherName;
            var publisher = Publishers.findOne({name: results.publisherName});
            if (publisher === undefined) results.errors.push("No publisher found in the system with the name: " + results.publisherName);
            else results.publisher = publisher._id;
        }


        results = ScienceXML.getAbstract(results, doc);


        //foreach if has subsections, call get all subsections function
        //foreach subsection get all the ps and title


        var sectionNodes = xpath.select("//body/sec[@id]", doc); //get all parent sections

        sectionNodes.forEach(function (section) {
            var childSectionNodes = xpath.select("child::sec[@id]", section);
            if (childSectionNodes.length) {
                var thisSection = ScienceXML.getOneSectionHtml(section, XMLserializer);
                results.sections.push({
                    label: thisSection.label,
                    title: thisSection.title,
                    body: thisSection.body,
                    sections: ScienceXML.getSubSection(childSectionNodes, XMLserializer)
                });
            }
            else
                results.sections.push(ScienceXML.getOneSectionHtml(section, XMLserializer));
        });

        var authorNodes = xpath.select("//contrib[@contrib-type='author']", doc);
        authorNodes.forEach(function (author) {
            var surname = xpath.select("child::name/surname/text()", author).toString();
            var given = xpath.select("child::name/given-names/text()", author).toString();
            var emailRef = xpath.select("child::xref[@ref-type='author-note']/text()", author).toString();
            if (surname === undefined) {
                results.errors.push("No surname found");
            } else if (given === undefined) {
                results.errors.push("No given name found");
            } else if (emailRef == false) {
                var fullName = {given: given, surname: surname};
                results.authors.push(fullName);
            } else {
                var fullName = {emailRef: emailRef, given: given, surname: surname};
                results.authors.push(fullName);
            }
        });
        if (results.authors.length === 0) {
            results.errors.push("No author found");
        }

        var refNodes = xpath.select("//ref", doc);
        refNodes.forEach(function (ref) {
            var refNodes = xpath.select("descendant::text()", ref);
            var text = "";
            if (refNodes[0]) {
                refNodes.forEach(function (reference) {
                    text += reference.data;
                });
            }
            var doi = xpath.select("descendant::pub-id[@pub-id-type='doi']/text()", ref).toString();
            if (doi) {
                results.references.push({ref: text, doi: doi});
            } else {
                results.references.push({ref: text});
            }
        });

        var authorNotesNodes = xpath.select("//author-notes/fn[@id]", doc);
        authorNotesNodes.forEach(function (note) {
            var noteLabel = xpath.select("child::label/text()", note).toString();
            var email = xpath.select("descendant::ext-link/text()", note).toString();
            if (noteLabel === undefined) {
                results.errors.push("No noteLabel found");
            } else if (email === undefined) {
                results.errors.push("No email found");
            } else {
                var enrty = {label: noteLabel, email: email};
                results.authorNotes.push(enrty);
            }
        });


        return results;
    }
});


