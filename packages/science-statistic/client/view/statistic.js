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
        var endMonth = $("#endDate").val()
        if(endMonth){
            var years = endMonth.substring(0,4);
            var months = endMonth.substring(5,7);
            if(months=="02"){
                if((years%4==0 && years%100!=0) || years%400==0) {
                    var endDate = endMonth + "-29";
                }else{
                    var endDate = endMonth + "-28";
                }
            }
            if(months=="01" || months=="03" || months=="05" || months=="07" || months=="08" || months=="10" || months=="12"){
                var endDate = endMonth+"-31";
            }
            if(months=="04" || months=="06" || months=="09" || months=="11" ){
                var endDate = endMonth+"-30";
            }
        }else {
            var endDate = new Date();
        }
        var reportType = $("#reportType").val();
        if(endDate&&endDate<startDate){
            sweetAlert(TAPi18n.__( "Start date should be less than end date"));
            return false;
        }
        if(!reportType){
            sweetAlert(TAPi18n.__( "Choose statistics template"));
            return false;
        }else{
            window.location.href = "/download-data?publisher="+publisher + "&publications="+publication+"&institution="+institution+"&startDate="+startDate+"&endDate="+endDate+"&reportType="+reportType
        }
    },
    'mousedown .select2-search__field': function(){
        var publisherId = $("#filter-publisher").val();
        Session.set("publisherId", publisherId);
    }
});