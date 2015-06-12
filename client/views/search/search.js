Template.SearchBar.events({
    'click .btn': function(){
        var query = $('#searchInput').val();
        if(query)
            Router.go('/s/'+query);
    }
});
Template.SearchResults.events({
    'click .onup': function(event){
        $(event.target).next("ul").toggle();
    }
});
Template.SearchResults.helpers({
    'results': function(){
        var q = Router.current().params.searchQuery;
        if(q)
        {
            var mongoDbArr = [];
            mongoDbArr.push({title: { $regex : q, $options:"i" } });
            mongoDbArr.push({authors: { $regex : q, $options:"i" } });
            return Articles.find({ $or: mongoDbArr});
        }
        var t = Router.current().params.topicQuery;
        if(t)
        {
            return Articles.find({ topic: t});
        }
        var a = Router.current().params.authorQuery;
        return  Articles.find({ authors: a});
    },
    urlToArticle:function(title){
        var article =Articles.findOne({title:title});
        var publisherName = Publishers.findOne({_id:article.publisher}).name;
        var journalName = Publications.findOne({_id:article.journalId}).title;
        return "/publisher/"+publisherName+"/journal/"+journalName+"/article/"+title;
    },
    'filters':function(){
        return [{
            filterTitle:'按出版商过滤浏览',
            filterOptions:[{
                name:'科学出版社',
                count:'121'
            },{
                name:'科学出版社',
                count:'113'
            },{
                name:'科学出版社',
                count:'141'
            }]
        },{
            filterTitle:'按出版物过滤浏览',
            filterOptions:[{
                name:'《科学出版社》',
                count:'21'
            },{
                name:'《科学》',
                count:'15'
            },{
                name:'《出版社》',
                count:'151'
            }]
        },{
            filterTitle:'按内容属性过滤浏览',
            filterOptions:[{
                name:'论文',
                count:'121'
            },{
                name:'评述',
                count:'113'
            },{
                name:'快讯',
                count:'141'
            }]
        },{
            filterTitle:'按作者过滤浏览',
            filterOptions:[{
                name:'谢和平',
                count:'121'
            },{
                name:'郑泽民',
                count:'113'
            },{
                name:'张龙',
                count:'141'
            }]
        },{
            filterTitle:'按出版日期过滤浏览',
            filterOptions:[{
                name:'2014年',
                count:'121'
            },{
                name:'2013年',
                count:'113'
            },{
                name:'2011年',
                count:'141'
            },{
                name:'2010年',
                count:'141'
            }]
        }]
    }
});


