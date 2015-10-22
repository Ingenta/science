Router.map(function () {
    this.route("newsPlatform", {
        path: "/miniplatform",
        layoutTemplate: "miniLayout"
    });
    this.route("test", {
        path: "/miniplatform/test",
        layoutTemplate: "miniLayout"
    });
});