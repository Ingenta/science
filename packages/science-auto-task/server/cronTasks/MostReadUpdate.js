SyncedCron.add({
    name: "MostReadUpdate",
    schedule: function (parser) {
        return parser.text("every 1 hour");
    },
    job: function () {
        updateMostRead();
    }
});

//Meteor.startup(function () {
//    updateMostRead();
//});