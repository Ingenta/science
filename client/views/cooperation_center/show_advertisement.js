Template.cooperationCenterDetails.helpers({
    adDetails: function () {
        var acId = Router.current().params.adId;
        return JournalAC.find({_id: acId});
    },
    latestAd: function () {
        return JournalAC.find({types: "1"},{sort: {releaseTime: -1}, limit: 10});
    },
    adUrl: function () {
        return "/cooperationCenter/" + this._id;
    }
});

Template.cooperationCenterDetails.onRendered(function(){
    var acId = Router.current().params.adId;
    var ad = JournalAC.findOne({_id: acId});
    if(ad) {
        JournalAC.update({_id: ad._id}, {$inc: {"pageView": 1}});
    }
});