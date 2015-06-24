/**
 * Telescope permissions
 * @namespace Users.can
 */
Users.can = {};

/**
 * Permissions checks.  Return true if all is well.
 * @param {Object} user - Meteor.user()
 */
Users.can.view = function (user) {
    //if (Settings.get('requireViewInvite', false)) {
    //
    //    if (Meteor.isClient) {
    //        // on client only, default to the current user
    //        user = (typeof user === 'undefined') ? Meteor.user() : user;
    //    }
    //
    //    return (!!user && (Users.is.admin(user) || Users.is.invited(user)));
    //}
    return true;
};
