Template.statistic.rendered = function () {
    this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM-DD'});
    $(document).ready(function() {
        $(".js-example-basic-multiple1").select2({
            placeholder: TAPi18n.__( "select publisher")
        //}).on('select',function(e,a){
        //    console.log(e)
        //    console.log(a);
        });
    });
    $(document).ready(function() {
        $(".js-example-basic-multiple2").select2({
            placeholder: TAPi18n.__( "select journal")
        });
    });
    $(document).ready(function() {
        $(".js-example-basic-multiple3").select2({
            placeholder: TAPi18n.__( "select institution")
        });
    });
};

Template.statistic.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
        var publisherId = Session.get("publisherId");
        if(publisherId)return Publications.find({publisher:{$in: publisherId}});
        return Publications.find();
    },
    institutionsList:function(){
        return Institutions.find();
    }
});

Template.statistic.events({
    'click .btn': function(){
        Router.go('/download-data');
    },
    'mousedown .select2-search__field': function(){
        var publisherId = $("#filter-publisher").val();
        Session.set("publisherId", publisherId);
    }
});