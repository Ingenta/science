/**
 * Created by jiangkai on 2015/5/29.
 */
Template.i18nLabel.helpers({
    label: function () {
        var i18n=PTi18n.findOne({code:Template.currentData().code}) || {code:Template.currentData().code,en:'not found',cn:'未设置'};

        return i18n;
    }
});