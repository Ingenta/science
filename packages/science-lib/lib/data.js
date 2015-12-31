Science.data={};

Science.data.tranContentType = function(origType){
    var contentType = origType.trim().toLowerCase();
    var trans ="other";
    _.each(Config.parser.contentTypeDic,function(dic,key){
        if (_.contains(dic, contentType))
            trans=key;
    })
    return trans;
}