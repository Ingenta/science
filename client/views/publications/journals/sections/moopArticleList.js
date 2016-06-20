var allmoops = new ReactiveVar([]);

var moopdoi = function(journalId){
    if(Session.get("currMoopIssue_"+journalId)){
        return _.pluck(_.filter(allmoops.get(), function (item) {
            return item.issueId == Session.get("currMoopIssue_" + journalId);
        }), "doi");
    }
    return _.pluck(allmoops.get(),"doi");
}

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
            var iss = Issues.find({'journalId': journalId, '_id':{$in:iArr}},{fields: {createDate: 0}, sort: {order: -1}}).fetch();
            return iss;
        }
    },
    class: function () {
        return this._id === Session.get("currentVolumeId") ? "fa-minus" : "fa-plus";
    },
    issueDisplay: function () {
        return this._id === Session.get("currentVolumeId") ? "block" : "none";
    },
    isUseless:function(){
        return !Session.get("currMoopIssue_"+this._id);
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
        articlePaginator.reset();
    },
    "click .showAllMoop": function(e){
        e.preventDefault();
        Session.set("currMoopIssue_" + this._id, null);
        articlePaginator.reset();
    }
});

Template.articleListRightOnlyMoop.helpers({
    articles: function () {
        var numPerPage = Session.get('PerPage') || 10;
        return articlePaginator.find({doi:{$in:moopdoi(this._id)}}, {itemsPerPage: numPerPage, sort: {padPage: 1}});
    },
    moreThan10: function(){
        if(!_.isEmpty(allmoops.get())){
            return moopdoi(this._id).length > 10;
        }
    }
});