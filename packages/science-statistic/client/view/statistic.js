Template.statistic.rendered = function () {
    //TODO switch this out for the datepicker and fix the wierd layout and remove the datetimepicker package
    this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM'});
    $(document).ready(function() {
        $(".js-multiple1").select2({
            placeholder: TAPi18n.__( "select publisher")
        });
    });
    $(document).ready(function() {
        $(".js-multiple2").select2({
            placeholder: TAPi18n.__( "select journal")
        });
    });
    $(document).ready(function() {
        $(".js-multiple3").select2({
            placeholder: TAPi18n.__( "select institution")
        });
    });
    $(document).ready(function() {
        $(".js-multiple4").select2({
            placeholder: TAPi18n.__( "Choose statistics template")
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
        var publisher = $("#filter-publisher").val();
        var publication = $("#filter-journal").val();
        var institution = $("#filter-institutions").val();
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var reportType = $("#reportType").val();
        if(!reportType){
            alert(TAPi18n.__( "Choose statistics template"));
        }else{
            window.location.href = "/download-data?publisher="+publisher + "&publications="+publication+"&institution="+institution+"&startDate="+startDate+"&endDate="+endDate+"&reportType="+reportType
        }
    },
    'mousedown .select2-search__field': function(){
        var publisherId = $("#filter-publisher").val();
        Session.set("publisherId", publisherId);
    }
});