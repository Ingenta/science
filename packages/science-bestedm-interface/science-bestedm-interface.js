Meteor.startup(function(){
    Config.bestedmInfo.BasicAuth ="Basic " + toBase64(Config.bestedmInfo.username+":" + Config.bestedmInfo.password);
})

function toBase64 (str) {
    return (new Buffer(str || '', 'utf8')).toString('base64')
}

BestedmHelper= {
    get:function(url,callback){
        Science.Request.get({url:url,headers:{Authorization:Config.bestedmInfo.BasicAuth}},function(err,response,body){
            if(!err)
                callback && callback(new Science.Dom().parseFromString(body));
        })
        return
    },
    post: function(url,params,callback){
        Science.Request.post({url:url,form:params,headers:{Authorization:Config.bestedmInfo.BasicAuth}},function(err,response,body){
            if(!err)
                callback && callback(new Science.Dom().parseFromString(body));
        })
    }
}

Bestedm = {
    Customer:{
        Subject:{}
    }
}