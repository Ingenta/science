moopCache=new ReactiveDict();

Template.moopDetails.helpers({
    hasMoops:function(){
        check(this.doi,String);
        check(this._id,String);
        var key = "moop_"+this._id;
        Meteor.call("getMoopForArticle",this.doi,function(err,result){
            if(!err)
                moopCache.set(key,result);
        })
        return !_.isEmpty(moopCache.get(key));
    },
    moopDatas:function(){
        return moopCache.get("moop_"+this._id);
    }
})