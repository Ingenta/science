Template.statistic.rendered = function () {
    this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM-DD'});
    $(document).ready(function() {
        $(".js-example-basic-multiple").select2();
    });
};

Template.statistic.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
        return Publications.find();
    },
    institutionsList:function(){
        return Institutions.find();
    }
});

Template.statistic.events({
    'click .btn': function(){
        Router.go('/download-data');
    }
});