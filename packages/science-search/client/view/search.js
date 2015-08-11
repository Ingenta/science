Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword){
            var query="title.cn:" + sw + " OR title.en:"+ sw ;
            Router.go('/search?q=' + query);
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword){
                var query="title.cn:" + sword + " OR title.en:"+ sword ;
                Router.go('/search?q=' + query);
            }
        }
    }
});

Template.SolrSearchResults.helpers({
    'results': function () {
        var q = Router.current().params.query.q;
        if (q) {
            Meteor.call("search",q,function(err,result){
                console.log(result);
            })
        }

    },
    'filters': function () {

//        Meteor.call("getFilter",filtername,query,function(err,result){
//            if(!err){
//                Session.set(filtername,result);
//            }
//
//        });
//        return Session.get(filtername);
        return [{
            filterTitle: TAPi18n.__("FILTER BY Publisher"),
            filterOptions: [{
                name: '科学出版社',
                count: '121'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Publications"),
            filterOptions: [{
                name: '《科学出版社》',
                count: '21'
            }, {
                name: '《科学》',
                count: '15'
            }, {
                name: '《出版社》',
                count: '151'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Content Properties"),
            filterOptions: [{
                name: '论文',
                count: '121'
            }, {
                name: '评述',
                count: '113'
            }, {
                name: '快讯',
                count: '141'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Author"),
            filterOptions: [{
                name: '谢和平',
                count: '121'
            }, {
                name: '郑泽民',
                count: '113'
            }, {
                name: '张龙',
                count: '141'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Release Data"),
            filterOptions: [{
                name: '2014年',
                count: '121'
            }, {
                name: '2013年',
                count: '113'
            }, {
                name: '2011年',
                count: '141'
            }, {
                name: '2010年',
                count: '141'
            }]
        }]
    }
});


