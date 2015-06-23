/**
 * roles
 * @namespace Users.is
 */
Users.is = {};

/**
 * Check if a user is an admin
 * 检查用户是否是管理员
 * @param {Object|string} 用户或用户Id userOrUserId - The user or their userId
 */
Users.is.admin = function (userOrUserId) {
    try {
        var user = Users.getUser(userOrUserId);
        return !!user && !!user.isAdmin;
    } catch (e) {
        return false; // user not logged in
    }
};
Users.is.adminById = Users.is.admin;


Meteor.users.helpers({
    isAdmin: function() {
        return Users.is.admin(this);
    }
});