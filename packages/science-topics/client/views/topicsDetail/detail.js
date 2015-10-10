Template.topicsDetailHeader.helpers({
    publisherName:function(){
        var pub = Publishers.findOne(this.publisherId);
        if(pub){
            return TAPi18n.getLanguage()=='zh-CN'?pub.chinesename:pub.name;
        }
        return "not found";
    },
    articleCount:function(){
        if(this.articles){
            return this.articles.length;
        }
        return 0;
    },
    name:function(){
        var top = Topics.findOne({_id:Router.current().params.topicsId});
        if(top){
            return TAPi18n.getLanguage()=='zh-CN'?top.name:top.englishName;
        }
    }
})