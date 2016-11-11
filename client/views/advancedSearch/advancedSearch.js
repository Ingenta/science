Template.AdvancedSearch.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM-DD'});
    $(".js-multiple1").select2();
    $(".js-multiple2").select2();
    $(".js-multiple3").select2();
    $(".js-multiple4").select2();
    $(".js-multiple5").select2();
});

Template.AdvancedSearch.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
        var publisherId = Session.get("publisherId");
        if(publisherId)return Publications.find({publisher:{$in: publisherId},visible:"1"});
        return Publications.find({visible:"1"});
    },
    topicList: function () {
        return Topics.find({parentId: undefined});
    },
    tagList: function () {
        return Tags.find();
    },
    contentTypeList: function(){
        return ContentType.find();
    }
});

Template.AdvancedSearch.events({
    'mousedown .select2-search__field': function(){
        var publisherId = $("#filter-publisher").val();
        Session.set("publisherId", publisherId);
    },
    'click .searchBtn': function () {

        var params = {};

        // 检索条件
        var name1 = $('#searchValue1').val().trim();
        var name2 = $('#searchValue3').val().trim();
        var name3 = $('#searchValue5').val().trim();
        var value1 = $('#searchValue6').val().trim();
        var value2 = $('#searchValue7').val().trim();
        var value3 = $('#searchValue8').val().trim();
        var condition1 = $('#searchValue2').val().trim();
        var condition2 = $('#searchValue4').val().trim();
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
        if(!_.isEmpty(query)){
            params.query=query;
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
        if(contentType){
            filterQuery["contentType"] = contentType;
        }

        if(!_.isEmpty(filterQuery)){
            params.filterQuery=filterQuery;
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

        if(sorting){
            params.setting={sort:sorting};
        }

        SolrQuery.search(params);
    }
});