var getArticleDoiFromFullDOI = function (fullDOI) {
    if (!fullDOI) return "";
    if (fullDOI.indexOf("/") === -1) return fullDOI;
    var articleDOI = fullDOI.split("/")[1];
    if (!articleDOI) return fullDOI;
    return articleDOI;
}
Meteor.methods({
    'parseXml': function (path) {
        var results = {};
        //Step 1: get the file
        var xml = ScienceXML.getFileContentsFromLocalPath(path);

        //Step 2: Validate and parse the file
        results.errors = ScienceXML.validateXml(xml);
        if (results.errors.length) {
            return results;
        }

        var doc = new dom().parseFromString(xml);

        // GET DOI, TITLE, VOLUME, ISSUE, MONTH, YEAR, ISSN, ESSN, TOPIC

        var doi = ScienceXML.getSimpleValueByXPath("//article-id[@pub-id-type='doi']", doc);
        if (doi === undefined) results.errors.push("No doi found");
        else {
            results.doi = doi;
            results.articledoi = getArticleDoiFromFullDOI(doi);
        }

        //    CHECK IF EXISTING ARTICLE
        var existingArticle = Articles.findOne({doi: results.doi});
        if (existingArticle !== undefined)results.errors.push("Article found matching this DOI: " + results.doi);


        var title = ScienceXML.getSimpleValueByXPath("//article-title", doc);
        if (title === undefined) results.errors.push("No title found");
        else results.title = title;

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

        var topic = ScienceXML.getSimpleValueByXPath("//article-categories/subj-group/subj-group/subject", doc);
        if (topic === undefined) results.errors.push("No subject found");
        else results.topic = topic;

        var keywords = xpath.select("//kwd-group[@kwd-group-type='inspec']/kwd/text()", doc).toString();
        keywords = keywords.split(',');
        if (keywords === undefined) results.errors.push("No keywords found");
        else results.keywords = keywords;

        var elocationId = ScienceXML.getSimpleValueByXPath("//article-meta/elocation-id", doc);
        if (elocationId !== undefined) results.elocationId = elocationId

        var essn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='epub']", doc);
        if (essn !== undefined) results.essn = essn;

        //    GET JOURNAL AND PUBLISHER BY NAME (consider changing journal to find my doi)
        var journalTitle = ScienceXML.getSimpleValueByXPath("//journal-title", doc);
        if (journalTitle === undefined) results.errors.push("No journal title found");
        else {
            results.journalTitle = journalTitle;
        }

        var issn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='ppub']", doc);
        if (issn === undefined) {
            results.errors.push("No issn found in xml");
        } else {
            results.issn = issn.replace("-", "");
            var journal = Publications.findOne({issn: results.issn});
            if (journal === undefined) results.errors.push("No such issn found in journal collection: " + issn);
            else {
                results.journalId = journal._id;
            }
        }

        var publisherName = ScienceXML.getSimpleValueByXPath("//publisher-name", doc);
        if (publisherName === undefined) results.errors.push("No publisher name found");
        else {
            results.publisherName = publisherName;
            var publisher = Publishers.findOne({name: results.publisherName});
            if (publisher !== undefined)
                results.publisher = publisher._id;
        }

        //      GET REFERENCES
        results.references = [];
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
                results.references.push({ref: text.substr(0, text.indexOf(doi)), doi: doi});
            } else {
                results.references.push({ref: text});
            }
        });

        //      GET ABSTRACT AND FULL TEXT
        results.sections = [];
        results = ScienceXML.getAbstract(results, doc);

        results = ScienceXML.getFullText(results, doc);


        //          GET AUTHORS, NOTES AND AFFILIATIONS
        results.authors = [];
        results.authorNotes = [];

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

        var affNode = xpath.select("//contrib-group", doc);
        if (affNode !== undefined) {
            results.affiliations = [];
            affNode.forEach(function (affiliation) {
                var affText = ScienceXML.getValueByXPathIgnoringXml("child::aff", affiliation);
                if (affText)results.affiliations.push(affText);
            });
        }
        var received = ScienceXML.getDateFromHistory("received", doc);
        if (received) results.received = received
        var accepted = ScienceXML.getDateFromHistory("accepted", doc);
        if (accepted) results.accepted = accepted
        var published = ScienceXML.getDateFromHistory("published", doc);
        if (published) results.published = published


        results.figures = ScienceXML.getFigures(doc);

        results.tables = ScienceXML.getTables(doc);


        return results;
    }
});
