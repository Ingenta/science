Router.map(function () {
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout"
    });

    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout"
    });

    this.route("cooperation", {
        path: "/miniplatform/cooperation",
        layoutTemplate: "cooperationContent"
    });

    this.route("contact", {
        path: "/miniplatform/contact",
        layoutTemplate: "contactContent"
    });

    this.route("magazineProfile", {
        path: "/miniplatform/magazineProfile",
        layoutTemplate: "magazineProfile"
    });

    this.route("council", {
        path: "/miniplatform/council",
        layoutTemplate: "councilContent"
    });

    this.route("memorabilia", {
        path: "/miniplatform/memorabilia",
        layoutTemplate: "memorabilia"
    });

    this.route("subscription", {
        path: "/miniplatform/subscription",
        layoutTemplate: "subscription"
    });
});