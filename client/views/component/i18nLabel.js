/**
 * Created by jiangkai on 2015/5/29.
 */
Template.i18nLabel.helpers({
    label: function () {
        var i18n=PTi18n.findOne({code:Template.currentData().code}) || {code:Template.currentData().code,en:'not found',cn:'未设置'};
        return i18n;
    }
});

Template.i18nLabel.events({
    'click .labelModify':function(event){
        $(event.target).next('.modifyDiv').toggle();
    },
    'click .btn-submit':function(event){
        var cn=$(event.target).siblings('.cn').val();
        var en=$(event.target).siblings('.en').val();
        var code=$(event.target).data().code;
        var id=$(event.target).data().iden;

        if(id){
            Meteor.call('updatei18n',{_id:id,code:code,cn:cn,en:en })
        }else{
            Meteor.call('inserti18n',{code:code,cn:cn,en:en });
        }
        $(event.target).parent().hide();

    }
})