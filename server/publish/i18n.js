/**
 * Created by jiangkai on 2015/5/30.
 */
Meteor.publish('PTi18n', function() {
    return PTi18n.find();
});
