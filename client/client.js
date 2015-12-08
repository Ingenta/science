this.App = {};
this.Helpers = {};

Meteor.startup(function () {
    TimeSync.loggingEnabled = false;
    var defaultPublisher = Publishers.findOne({name: Config.defaultPublisherShortName});
    if(defaultPublisher) Science.defaultPublisherId = defaultPublisher._id;
});

App.logout = function () {
    Meteor.logout(function (err) {
    });
};

this.menuItemClass = function (routeName) {
    //if (!routeGranted(routeName)) {
    //    return "hidden";
    //}

    if (!Router.current() || !Router.current().route) {
        return "";
    }

    if (!Router.routes[routeName]) {
        return "";
    }

    var currentPath = Router.routes[Router.current().route.getName()].handler.path;
    var routePath = Router.routes[routeName].handler.path;

    if (routePath === "/") {
        return currentPath == routePath ? "active" : "";
    }

    return currentPath.indexOf(routePath) === 0 ? "active" : "";
};

this.confirmDelete = function(event,callback){
    event.preventDefault();
    sweetAlert({
        title             : TAPi18n.__("Warning"),
        text              : TAPi18n.__("Confirm_delete"),
        type              : "warning",
        showCancelButton  : true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText : TAPi18n.__("Do_it"),
        cancelButtonText  : TAPi18n.__("Cancel"),
        closeOnConfirm    : false
    }, function () {
        callback();
        sweetAlert({
            title:TAPi18n.__("Deleted"),
            text:TAPi18n.__("Operation_success"),
            type:"success",
            timer:2000
        });
    });
}

Helpers.menuItemClass = function (routeName) {
    return menuItemClass(routeName);
};

Helpers.userFullName = function () {
    var name = "";
    if (Meteor.user())
        name = Meteor.user().username;
    return name;
};

Helpers.userEmail = function () {
    var email = "";
    if (Meteor.user())
        email = Meteor.user().emails[0].address;
    return email;
};

Helpers.randomString = function (strLen) {
    return Random.id(strLen);
};

Helpers.secondsToTime = function (seconds, timeFormat) {
    return secondsToTime(seconds, timeFormat);
};

Helpers.integerDayOfWeekToString = function (day) {
    if (_.isArray(day)) {
        var s = "";
        _.each(day, function (d, i) {
            if (i > 0) {
                s = s + ", ";
            }
            s = s + ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];
        });
        return s;
    }
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];
};

Helpers.formatDate = function (date, dateFormat) {
    if (!date) {
        return "";
    }

    var f = dateFormat || "MM/DD/YYYY";

    if (_.isString(date)) {
        if (date.toUpperCase() == "NOW") {
            date = new Date();
        }
        if (date.toUpperCase() == "TODAY") {
            d = new Date();
            date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        }
    }

    return moment(date).format(f);
};

Helpers.integerToYesNo = function (i) {
    return i ? "Yes" : "No";
};

Helpers.integerToTrueFalse = function (i) {
    return i ? "True" : "False";
};

_.each(Helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper);
});

