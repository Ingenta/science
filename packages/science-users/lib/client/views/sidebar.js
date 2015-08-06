Template.LayoutSideBar.helpers({
    institutionLogo: function () {
        var currentUserIPNumber = Session.get("currentUserIPNumber");
        if (currentUserIPNumber === undefined) {
            Meteor.call("getClientIP", function (err, ip) {
                currentUserIPNumber = Science.ipToNumber(ip);
                Session.set("currentUserIPNumber", currentUserIPNumber);
            });
        }
        var logo = undefined;
        var institutuion = Institutions.findOne({ipRange: {$elemMatch: {startNum: {$lte: currentUserIPNumber}, endNum: {$gte: currentUserIPNumber}}}});
        if (institutuion) {
            logo = Images && institutuion.logo && Images.findOne({_id: institutuion.logo}).url();
        }
        if (logo) return '<img src="' + logo + '" width="100%" height="auto"/>';
        else return;
    },
    canUseAdminPanel: function () {
        return !!Permissions.getUserRoles().length;
    }
});