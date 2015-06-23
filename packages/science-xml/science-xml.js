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

        //TODO: figure out how to get abstract when html is inside the node, perhaps encode.

        var abstractNode = xpath.select("//abstract/p/text()", doc);

        if (abstractNode === undefined)  results.errors.push("No abstract found");
        else {
            var abstractText="";
            for (i = 0; i < abstractNode.length; i++) {
                abstractText += abstractNode[i].data;
            }
            results.abstract = abstractText;
        }

        //TODO: figure out how to get each in this list, object should look like this authors: {{given: "Jack", surname: "Kavanagh},{given: "¶¬¶¬"£¬ surname:"Ñî"}}

        var authorGivenNodes = xpath.select("//contrib/name/given-names", doc);
        if (authorGivenNodes[0] === undefined) results.errors.push("No given name found");
        if (authorGivenNodes[0] !== undefined)
            results.authorGiven = authorGivenNodes[0].firstChild.data;

        var authorNodes = xpath.select("//contrib/name/surname", doc);
        if (authorNodes[0] === undefined) results.errors.push("No surname found");
        if (authorNodes[0] !== undefined)
            results.author = authorNodes[0].firstChild.data;




        return results;
    }
});


