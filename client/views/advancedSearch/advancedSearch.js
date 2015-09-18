Template.AdvancedSearch.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
    $("input[id='ck_publisher']").prop({checked:true});
    $("input[id='ck_journal']").prop({checked:true});
    $("input[id='ck_topic']").prop({checked:true});
    $("input[id='ck_contentType']").prop({checked:true});
    $("input[id='ck_tag']").prop({checked:true});
    $("input[name='publisher']").prop({disabled:true});
    $("input[name='journal']").prop({disabled:true});
    $("input[name='topic']").prop({disabled:true});
    $("input[name='contentType']").prop({disabled:true});
    $("input[name='tag']").prop({disabled:true});
});

Template.AdvancedSearch.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
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
    "click #ck_publisher": function () {
        if(document.getElementById("ck_publisher").checked){
            $("input[id='ck_publisher']").prop({checked:true});
            $("input[name='publisher']").prop({disabled:true});
        }else{
            $("input[id='ck_publisher']").prop({checked:false});
            $("input[name='publisher']").prop({disabled:false});
        }
    },
    'click #ck_journal': function () {
        if(document.getElementById("ck_journal").checked){
            $("input[id='ck_journal']").prop({checked:true});
            $("input[name='journal']").prop({disabled:true});
        }else{
            $("input[id='ck_journal']").prop({checked:false});
            $("input[name='journal']").prop({disabled:false});
        }
    },
    'click #ck_topic': function () {
        if(document.getElementById("ck_topic").checked){
            $("input[id='ck_topic']").prop({checked:true});
            $("input[name='topic']").prop({disabled:true});
        }else{
            $("input[id='ck_topic']").prop({checked:false});
            $("input[name='topic']").prop({disabled:false});
        }
    },
    'click #ck_contentType': function () {
        if(document.getElementById("ck_contentType").checked){
            $("input[id='ck_contentType']").prop({checked:true});
            $("input[name='contentType']").prop({disabled:true});
        }else{
            $("input[id='ck_contentType']").prop({checked:false});
            $("input[name='contentType']").prop({disabled:false});
        }
    },
    'click #ck_tag': function () {
        if(document.getElementById("ck_tag").checked){
            $("input[id='ck_tag']").prop({checked:true});
            $("input[name='tag']").prop({disabled:true});
        }else{
            $("input[id='ck_tag']").prop({checked:false});
            $("input[name='tag']").prop({disabled:false});
        }
    },
    'click #publisherBtn': function (e) {
        $("#myModal").modal('hide');
    },
    'click #journalBtn': function (e) {
        $("#myModal1").modal('hide');
    },
    'click #topicBtn': function (e) {
        $("#myModal2").modal('hide');
    },
    'click #contentTypeBtn': function (e) {
        $("#myModal3").modal('hide');
    },
    'click #tagBtn': function (e) {
        $("#myModal4").modal('hide');
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

        //结果排序
        var orders = $('#sort').val();
        //出版时间
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        //选择检索控制筛选条件
        var str1 = document.getElementsByName("publisher");
        var str2 = document.getElementsByName("journal");
        var str3 = document.getElementsByName("topic");
        var str4 = document.getElementsByName("contentType");
        var str5 = document.getElementsByName("tag");
        var filterQuery = [];

        if(orders){
            filterQuery.push({key:"publisher",val:orders});
        }

        if(startDate||endDate){
            filterQuery.push({key:"publishDate",val:{start:startDate,end:endDate}});
        }

        if(0<str1.length){
            for (i = 0; i < str1.length; i++) {
                if (str1[i].checked) {
                    filterQuery.push({key:"publisher",val:str1[i].value});
                }
            }
        }
        if(0<str2.length){
            for (i = 0; i < str2.length; i++) {
                if (str2[i].checked) {
                    filterQuery.push({key:"journalId",val:str2[i].value});
                }
            }
        }
        if(0<str3.length){
            for (i = 0; i < str3.length; i++) {
                if (str3[i].checked) {
                    filterQuery.push({key:"topic",val:str3[i].value});
                }
            }
        }
        //if(0<str4.length){
        //    for (i = 0; i < str4.length; i++) {
        //        if (str4[i].checked) {
        //            filterQuery.push({key:"publisher",val:str4[i].value});
        //        }
        //    }
        //}
        //if(0<str5.length){
        //    for (i = 0; i < str5.length; i++) {
        //        if (str5[i].checked) {
        //            filterQuery.push({key:"publisher",val:str5[i].value});
        //        }
        //    }
        //}

        SolrQuery.search({query:query,filterQuery:filterQuery});
    }
});