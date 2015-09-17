Template.AdvancedSearch.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
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
    'click .btn': function () {
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
        SolrQuery.search({query:query});
    }
});