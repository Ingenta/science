

if (Meteor.isServer) {
    var getLocationAsync = function (path, cb){
        cb && cb(null, HTTP.get(path).content);
    };
}


Meteor.methods({
    'parseXml':function(path){
        //Step 1: get the file
        path = Meteor.absoluteUrl(path);
        var getLocationSync = Meteor.wrapAsync(getLocationAsync)
        var xml = getLocationSync(path);
        //Step 2: Parse the file
        var doc = new dom().parseFromString(xml);
        //Step 3: Read the xpaths
        var titleNodes = xpath.select("//title", doc);
        var authorNodes = xpath.select("//author", doc);
        //Step 4: Return the article object
        var results = {};
        if(titleNodes[0]!==undefined)
            results.title= titleNodes[0].firstChild.data;

        if(authorNodes[0]!==undefined)
            results.author = authorNodes[0].firstChild.data;

        //Step 5: if anything went wrong add an errors object to the article
        if(titleNodes[0]===undefined) results.errors=["No title found"];
        if(authorNodes[0]===undefined) results.errors=["No author found"];
        return results;
    }
});

