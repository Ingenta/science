Router.map(function () {
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout"
    });
    this.route("authorCentered", {
        path: "/miniplatform/authorCentered",
        layoutTemplate: "miniLayout"
    });
});