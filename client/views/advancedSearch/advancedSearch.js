Template.AdvancedSearch.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM-DD'});
    $(document).ready(function() {
        $(".js-multiple1").select2({
            placeholder: TAPi18n.__( "Publisher name")
        });
    });
    $(document).ready(function() {
        $(".js-multiple2").select2({
            placeholder: TAPi18n.__( "Journal name")
        });
    });
    $(document).ready(function() {
        $(".js-multiple3").select2({
            placeholder: TAPi18n.__( "The topic name")
        });
    });
    $(document).ready(function() {
        $(".js-multiple4").select2({
            placeholder: TAPi18n.__( "Article Content Type")
        });
    });
    $(document).ready(function() {
        $(".js-multiple5").select2({
            placeholder: TAPi18n.__( "Journal label")
        });
    });
});

Template.AdvancedSearch.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
        var publisherId = Session.get("publisherId");
        if(publisherId)return Publications.find({publisher:{$in: publisherId}});
        return Publications.find();
    },
    topicList: function () {
        return Topics.find({parentId: undefined});
    },
    tagList: function () {
        return Tags.find();
    }
});

Template.AdvancedSearch.events({
    'mousedown .select2-search__field': function(){
        var publisherId = $("#filter-publisher").val();
        Session.set("publisherId", publisherId);
    },
    'click .searchBtn': function () {
        // 检索条件
        var name1 = $('#searchValue1').val();
        var name2 = $('#searchValue3').val();
        var name3 = $('#searchValue5').val();
        var value1 = $('#searchValue6').val();
        var value2 = $('#searchValue7').val();
        var value3 = $('#searchValue8').val();
        var condition1 = $('#searchValue2').val();
        var condition2 = $('#searchValue4').val();

        var query = [];
        var flag=false;
        if(name1){
            query.push({key:value1,val:name1})
            flag=true;
        }
        if(name2){
            var p = {key:value2,val:name2};
            if(flag){
                p.logicRelation=condition1;
            }
            query.push(p);
            flag=true;
        }
        if(name3){
            var p = {key:value3,val:name3};
            if(flag){
                p.logicRelation=condition2;
            }
            query.push(p);
            flag=true;
        }

        //---------------------------------------筛选条件------------------------------------------

        //出版时间
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        //选择检索控制筛选条件
        var publisher = $("#filter-publisher").val();
        var journal = $("#filter-journal").val();
        var topic = $("#filter-topic").val();
        var contentType = $("#filter-contentType").val();
        var tag = $("#filter-tag").val();
        var filterQuery = {};

        if(startDate||endDate){
            filterQuery["publishDate"] ={start:startDate,end:endDate};
        }

        if(publisher){
            filterQuery["publisher"] = publisher;
        }
        if(journal){
            filterQuery["journalId"] = journal;
        }
        if(topic){
            filterQuery["topic"] = topic;
        }
        //---------------------------------------结果排序------------------------------------------

        //结果排序
        var orders = $('#sort').val();
        var sorting = "";

        if(orders=="1"){
            sorting = "publishDate desc";
        }

        if(orders=="2"){
            sorting = "publishDate asc";
        }

        SolrQuery.search({query:query,filterQuery:filterQuery,setting:{sort:sorting}});
    }
});