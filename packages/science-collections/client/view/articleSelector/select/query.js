Template.addArticleForCollection.events({
	"click .search-btn": function () {
		var qf = $(".queryField");
		var q = {};
		_.each(qf, function (item) {
			var val = $(item).val();
			if (val) {
				var qfield                   = $(item).data().queryfield;
				val                          = qfield == 'title.en' ? {$regex: val, $options: "i"} : val;
				q[$(item).data().queryfield] = val;
			}
		});
		Session.set("query", q);
	}
});

Template.searchArticleForAddToCollection.helpers({
	journals: function () {
		return Publications.find({publisher: Session.get("publisherId")}, {title: 1});
	},
    volumes: function () {
        if(Session.get("journalId")){
            var query = {journalId: Session.get("journalId")};
            return Volumes.find(query);
        }
    },
    issues: function () {
        if(Session.get("volume"))
        console.log();
             return Issues.find({volume: Session.get("volume"),journalId: Session.get("journalId")});
    },
    journalId : function(){
        return Session.get("currentJournalId");
    }
});
Template.searchArticleForAddToCollection.events({
    "change #journalSelect" : function(e){
        Session.set("journalId",$(e.target).val());
        Session.set("volume", null);
    },
    "change #volumesSelect" :function(e) {
        Session.set("volume", $(e.target).val());
    }
});
Template.searchArticleForAddToCollection.onRendered(function(){
    Session.set("journalId", Session.get("currentJournalId"));
    Session.set("volume", null);
    Session.set("issue", null);
    Session.set("query", null);
})
