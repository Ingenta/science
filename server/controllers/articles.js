Meteor.methods({
    'distinctVolume': function (journalId) {
        result = Issues.distinct("volume", {"journalId": journalId});
        console.dir(result);
        return result;
    },
    'grabSessions': function(id){
        var c = UserStatus.connections.findOne({userId:id});
//        var geo = ScienceXML.getFileContentsFromFullPath("http://freegeoip.net/json/"+"175.144.126.252");
//        console.log(geo);
        return c.ipAddr;
    }
});

