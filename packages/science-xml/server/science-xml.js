if (Meteor.isServer) {
    var getLocationAsync = function (path, cb) {
        cb && cb(null, HTTP.get(path).content);
    };
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
        var doc = new dom().parseFromString(xml);
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

        //TODO: figure out how to get abstract when html is inside the node, perhaps encode.

        var doiNode = xpath.select("//article-id[@pub-id-type='doi']/text()", doc)[0];
        if (doiNode === undefined) results.errors.push("No doi found");
        else results.doi = doiNode.data;

        var abstractNode = xpath.select("//abstract/p/text()", doc);

        if (abstractNode[0] === undefined)  results.errors.push("No abstract found");
        else {
            var abstractText="";
            for (i = 0; i < abstractNode.length; i++) {
                abstractText += abstractNode[i].data;
            }
            results.abstract = abstractText;
        }

        //TODO: figure out how to get each in this list, object should look like this authors: {{given: "Jack", surname: "Kavanagh},{given: "����"�� surname:"��"}}

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
        return results;
    }
});


