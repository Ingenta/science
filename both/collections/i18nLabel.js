/**
 * Created by jiangkai on 2015/5/30.
 */
this.PTi18n = new Meteor.Collection("PTi18n");

Meteor.methods({
    inserti18n:function(i18n){
        PTi18n.insert(i18n);
    },
    updatei18n:function(i18n){
        PTi18n.update({_id:i18n._id},{$set:{en:i18n.en,cn:i18n.cn}});
    }
})