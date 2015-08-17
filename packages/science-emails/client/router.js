Router.route("/emails/", {
    parent: "home",
    name: "emails",
    template:"Emails",
    title: function () {
        return TAPi18n.__("Emails this page");
    },
    waitOn: function () {
        return [
//            Meteor.subscribe('emails')
        ]
    }
});