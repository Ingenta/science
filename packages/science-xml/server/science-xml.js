if (Meteor.isServer) {
    var getLocationAsync = function (path, cb) {
        cb && cb(null, HTTP.get(path).content);
    }
    var getXmlFromPath = function (path) {
        var getLocationSync = Meteor.wrapAsync(getLocationAsync)
        return getLocationSync(Meteor.absoluteUrl(path));
    }
}


Meteor.methods({
    'parseXml': function (path) {
        var results = {};
        results.errors = [];
        results.authors = [];

        //Step 1: get the file
        var xml = getXmlFromPath(path);
        //Step 2: Parse the file TODO: figure out a way to get any namespace errors or validation and push them into the results object.
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



        var authorNodes = xpath.select("//contrib[@contrib-type='author']/name", doc);
        authorNodes.forEach(function (author) {
            var surname = xpath.select("child::surname/text()", author).toString();
            var given = xpath.select("child::given-names/text()", author).toString();
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


        return results;
    }
});


