if (Meteor.isServer) {
    var getLocationAsync = function (path, cb) {
        cb && cb(null, HTTP.get(path).content);
    }
    var getXmlFromPath = function (path) {
        var getLocationSync = Meteor.wrapAsync(getLocationAsync);
        //remove first / from path because meteor absolute url includes it absoluteurl = 'https://science-ci.herokuapp.com/' path = "/cfs/test.xml/89ndweincdsnc"
        if(path===undefined)return;
        var fullPath = Meteor.absoluteUrl(path.substring(1));
        return getLocationSync(fullPath);
    }
}


Meteor.methods({
    'parseXml': function (path) {
        var results = {};
        results.errors = [];
        results.authors = [];
        results.authorNotes = [];
        results.references = [];

        //Step 1: get the file
        var xml = getXmlFromPath(path);

        //Step 2: Parse the file
        var xmlErrors = [];
        var xmlDom = new dom({
            errorHandler: function(msg){
                xmlErrors.push(msg)
            }
        });
        var doc = xmlDom.parseFromString(xml);
        if(xmlErrors.length)
        {
            for (i = 0; i < xmlErrors.length; i++) {
                results.errors.push(xmlErrors[i]);
            }
            return results;
        }

        //Step 3: Read the xpaths FOREACH:
        //Step 4: if anything went wrong add an errors object to the article
        //Step 5: Return the article object

        var titleNodes = xpath.select("//article-title", doc);
        if (titleNodes[0] === undefined) results.errors.push("No title found");
        else results.title = titleNodes[0].firstChild.data;

        var volumeNode = xpath.select("//volume", doc)[0];
        if (volumeNode === undefined) results.errors.push("No volume found");
        else results.volume = volumeNode.firstChild.data;

        var issueNode = xpath.select("//issue", doc)[0];
        if (issueNode === undefined) results.errors.push("No issue found");
        else results.issue = issueNode.firstChild.data;

        var monthNode = xpath.select("//pub-date/month/text()", doc)[0];
        if (monthNode === undefined) results.errors.push("No month found");
        else results.month = monthNode.data;

        var yearNode = xpath.select("//pub-date/year/text()", doc)[0];
        if (yearNode === undefined) results.errors.push("No year found");
        else results.year = yearNode.data;

        var doiNode = xpath.select("//article-id[@pub-id-type='doi']/text()", doc)[0];
        if (doiNode === undefined) results.errors.push("No doi found");
        else results.doi = doiNode.data;
        //TODO: if doi is already found then add to articles collection
        //var existingArticle = Articles.findOne({doi: results.doi});
        //if(existingArticle!==undefined)results.errors.push("Article found matching this DOI: "+results.doi);

        var affNode = xpath.select("//contrib-group/aff/descendant::text()", doc);
        if(affNode[0] !== undefined) {
            results.affiliations = "";
            affNode.forEach(function (affiliation) {
                results.affiliations += affiliation.data;
            });
        }

        var issnNode = xpath.select("//issn[@pub-type='ppub']/text()", doc)[0];
        if(issnNode !== undefined) results.issn = issnNode.data;

        var essnNode = xpath.select("//issn[@pub-type='epub']/text()", doc)[0];
        if (essnNode === undefined) results.errors.push("No essn found");
        else results.essn = essnNode.data;

        var journalTitleNode = xpath.select("//journal-title/text()", doc)[0];
        if (journalTitleNode === undefined) results.errors.push("No journal title found");
        else results.journalTitle = journalTitleNode.data;

        var journal = Publications.findOne({title:results.journalTitle});
        if(journal===undefined)
            results.errors.push("No journal title found in the system with the name: "+results.journalTitle);
        else results.journalId = journal._id;

        var publisherNameNode = xpath.select("//publisher-name/text()", doc)[0];
        if (publisherNameNode === undefined) results.errors.push("No publisher name found");
        else results.publisherName = publisherNameNode.data;

        var publisher = Publishers.findOne({name:results.publisherName});
        if(publisher===undefined)
            results.errors.push("No publisher found in the system with the name: "+results.publisherName);
        else results.publisher = publisher._id;

        var abstractNode = xpath.select("//abstract/p/text()", doc);

        if (abstractNode[0] === undefined)  results.errors.push("No abstract found");
        else {
            var abstractText="";
            for (i = 0; i < abstractNode.length; i++) {
                abstractText += abstractNode[i].data;
            }
            results.abstract = abstractText;
        }

        var pubYear = xpath.select("//pub-date/year/text()", doc).toString();
        var pubVolume = xpath.select("//article-meta/volume/text()", doc).toString();
        var elocationId = xpath.select("//article-meta/elocation-id/text()", doc).toString();
        results.articleMetaStr = results.journalTitle + ' <b>' + pubVolume + '</b>, '+ elocationId + '('+pubYear+')';

        var authorNodes = xpath.select("//contrib[@contrib-type='author']", doc);
        authorNodes.forEach(function (author) {
            var surname = xpath.select("child::name/surname/text()", author).toString();
            var given = xpath.select("child::name/given-names/text()", author).toString();
            var lablel = xpath.select("child::given-names/text()", author).toString();
            if(surname === undefined){
                results.errors.push("No surname found");
            } else if(given === undefined){
                results.errors.push("No given name found");
            } else{
                var fullName ={given: given, surname: surname};
                results.authors.push(fullName);
            }
        });
        if(results.authors.length === 0){
            results.errors.push("No author found");
        }

        var refNodes = xpath.select("//ref", doc);
        refNodes.forEach(function (ref) {
            var refNodes = xpath.select("descendant::text()", ref);
            var text = "";
            if(refNodes[0]) {
                refNodes.forEach(function (reference) {
                    text += reference.data;
                });
            }
            var doi = xpath.select("descendant::pub-id[@pub-id-type='doi']/text()", ref).toString();
            if(doi){
                results.references.push({ref: text, doi: doi});
            } else{
                results.references.push({ref: text});
            }
        });

        var authorNotesNodes = xpath.select("//author-notes/fn[@id]", doc);
        authorNotesNodes.forEach(function (note) {
            var noteLabel = xpath.select("child::label/text()", note).toString();
            var email = xpath.select("descendant::ext-link/text()", note).toString();
            if(noteLabel === undefined){
                results.errors.push("No noteLabel found");
            } else if(email === undefined){
                results.errors.push("No email found");
            } else{
                var enrty ={label: noteLabel, email: email};
                results.authorNotes.push(enrty);
            }
        });

        return results;
    }
});


