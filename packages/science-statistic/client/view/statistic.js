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
        var query={};
        var publisherId = Session.get("publisherId");
        if(publisherId)
            query.publisher={$in: publisherId};
        if(!Permissions.isAdmin()){
            var permissionScope = Permissions.getPermissionRange(Meteor.userId(),"platform:use-statistic");
            if(permissionScope.length)
                query._id = {$in:permissionScope.journal};
        }
        return Publications.find(query);
    },
    institutionsList:function(){
        return Institutions.find();
    }
});

Template.statistic.events({
    'click .btn': function(){
        var user = Users.findOne({_id: Meteor.userId()});
        var publisher = $("#filter-publisher").val();
        var publication = $("#filter-journal").val();
        if(publication==null){
            if(user){
                if(user.orbit_roles){
                    if(user.orbit_roles[1]) {
                        if (user.orbit_roles[1].scope) {
                            if (user.orbit_roles[1].scope.journal) {
                                publication = user.orbit_roles[1].scope.journal;
                            }
                        }
                    }
                }
            }
        }
        var institution = $("#filter-institutions").val();
        var startMonth = $("#startDate").val();
        var endMonth = $("#endDate").val();
        var reportType = $("#reportType").val();
        var startDate = "";
        var endDate = "";
        if(startMonth){
            startDate = startMonth.replace("-","");
        }
        if(endMonth){
            endDate = endMonth.replace("-","");
        }
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