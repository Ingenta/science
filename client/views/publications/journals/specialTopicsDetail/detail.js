Template.specialTopicsDetailHeader.helpers({
    collInfo: function () {
        var coll = SpecialTopics.findOne({_id: Router.current().params.specialTopicsId});
        if(!coll)return;
        Session.set("addedArticlesTo", coll.articles ? coll.articles : []);
        return coll;
    },
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
    }
})
