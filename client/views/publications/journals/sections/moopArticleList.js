var allmoops = new ReactiveVar();

Template.journalNavigationPanelOnlyMoop.onRendered(function(){
    if (this.data && this.data._id) {
        allmoops.set(Collections.Medias.find({journalId:this.data._id,doi:{$exists:1}},{fields:{doi:1, volumeId:1,issueId:1}}).fetch());
    }
})

Template.journalNavigationPanelOnlyMoop.helpers({
    volumeInJournal: function (journalId) {
        if (journalId) {
            if(!_.isEmpty(allmoops.get())){
                var vArr = _.uniq(_.pluck(allmoops.get(),"volumeId"));
                var v = Volumes.find({'journalId': journalId,_id:{$in:vArr}}).fetch();
                var vols = _.sortBy(v, function (oneVolume) {
                    return parseInt(oneVolume.volume, 10);
                }).reverse();
                if(!_.isEmpty(vols)){
                    Session.set("currMoopVol_"+journalId,vols[0].volume);
                }
                return vols;
            }
        }
    },
    issueInVolume: function (journalId, volumeId) {
        if (journalId && volumeId && !_.isEmpty(allmoops.get())) {
            var iArr = _.uniq(_.pluck(_.filter(allmoops.get(),function(item){
                return item.volumeId = volumeId;
            }),"issueId"));
            var issues = Issues.find({'journalId': journalId, '_id':{$in:iArr}}).fetch();
            var iss = _.sortBy(issues, function (oneIssue) {
                return parseInt(oneIssue.issue, 10);
            }).reverse();
            if(!_.isEmpty(iss) && iss[0].volume==Session.get("currMoopVol_"+journalId)){
                Session.set("currMoopIssue_"+journalId,iss[0]._id);
            }
            return iss;
        }
    },
    formatMonth: function () {
        return this.month ? (", " + this.month) : "";
    },
    class: function () {
        return this._id === Session.get("currentVolumeId") ? "fa-minus" : "fa-plus";
    },
    issueDisplay: function () {
        return this._id === Session.get("currentVolumeId") ? "block" : "none";
    }
});

Template.journalNavigationPanelOnlyMoop.events({
    "click .volume": function (event) {
        var toggleOption = ["fa-plus", "fa-minus"];
        var remove = $(event.currentTarget).find("i.fa-plus").length ? 0 : 1;
        $(event.currentTarget).find("i").removeClass(toggleOption[remove]).addClass(toggleOption[1 - remove]);
        $(event.currentTarget).next(".issues").slideToggle(200);
    },
    "click .issue": function (event) {
        var issueId = $(event.target).data().value;
        issueId && Session.set("currMoopIssue_" + this.journalId, issueId);
    }
});

Template.articleListRightOnlyMoop.helpers({
    articles: function () {
        if(!_.isEmpty(allmoops.get())){
            var journalId = this._id;
            var dois = _.pluck(_.filter(allmoops.get(),function(item){
                return item.issueId == Session.get("currMoopIssue_"+journalId);
            }),"doi");
            return Articles.find({doi:{$in:dois}}, {sort: {elocationId: 1}});
        }
    }
});