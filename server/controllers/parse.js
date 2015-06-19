var getLocationAsync = function (path, cb){
    cb && cb(null, HTTP.get(path).content);
};

Meteor.methods({
    'parseXml':function(path){
        //Step 1: get the file
        path = Meteor.absoluteUrl(path);
        var getLocationSync = Meteor.wrapAsync(getLocationAsync)
        var xml = getLocationSync(path);
        //Step 2: Parse the file

        //Step 3: Read the xpaths

        //Step 4: Return the article object

        //Step 5: if anything went wrong add an errors object to the article
        console.log(xml);
        result = "success"
        return result;
    }
});

