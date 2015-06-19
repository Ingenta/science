var getLocationAsync = function (path, cb){
    cb && cb(null, HTTP.get(path).content);
};

Meteor.methods({
    'parseXml':function(path){
        path = "http://localhost:3000"+path;
        var getLocationSync = Meteor.wrapAsync(getLocationAsync)
        var xml = getLocationSync(path)
        console.log(xml);
        result = "test";
        return result;
    }
});

