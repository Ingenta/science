Router.map(function () {
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout"
    });

    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout"
    });

    this.route("journalArticle", {
        path: "/miniplatform/authorCentered/:journalTitle",
        layoutTemplate: "miniLayout",
        data: function () {
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (journal) {
                Session.set('currentJournalId', journal._id);
                return journal;
            }
        }
    });

    this.route("cooperation", {
        path: "/miniplatform/cooperation",
        layoutTemplate: "miniLayout"
    });

    this.route("contact", {
        path: "/miniplatform/contact",
        layoutTemplate: "miniLayout"
    });

    this.route("magazineProfile", {
        path: "/miniplatform/magazineProfile",
        layoutTemplate: "miniLayout"
    });

    this.route("council", {
        path: "/miniplatform/council",
        layoutTemplate: "miniLayout"
    });

    this.route("memorabilia", {
        path: "/miniplatform/memorabilia",
        layoutTemplate: "miniLayout"
    });

    this.route("subscription", {
        path: "/miniplatform/subscription",
        layoutTemplate: "miniLayout",
        waitOn: function () {
            return [
                Meteor.subscribe('files')
            ]
        }
    });
});