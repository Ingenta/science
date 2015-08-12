Template.addArticleForTopics.events({
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

Template.searchArticleForAddToTopics.helpers({
    publishers: function () {
        return Publishers.find();
    },
	journals: function () {
        if(Session.get("publisherId")){
            return Publications.find({publisher: Session.get("publisherId")}, {title: 1});
        }
	},
    volumes: function () {
        if(Session.get("journalId")){
            var query = {journalId: Session.get("journalId")};
            return Volumes.find(query);
        }
    },
    issues: function () {
        if(Session.get("volume"))
             return Issues.find({volume: Session.get("volume"),journalId: Session.get("journalId")});
    }
});
Template.searchArticleForAddToTopics.events({
    "change #publisherSelect" : function(e){
        Session.set("publisherId",$(e.target).val());
        Session.set("journalId", null);
    },
    "change #journalSelect" : function(e){
        Session.set("journalId",$(e.target).val());
        Session.set("volume", null);
    },
    "change #volumesSelect" :function(e) {
        Session.set("volume", $(e.target).val());
    }
});
Template.searchArticleForAddToTopics.onRendered(function(){
    Session.set("journalId", null);
    Session.set("volume", null);
    Session.set("issue", null);
    Session.set("query", null);
})
