Science.data={};

Science.data.tranContentType = function(origType){
    if(!origType)return null;
    var contentType = origType.trim().toLowerCase();
    var trans = null;
    console.log("111111");
    console.log(ContentType.find({},{fields: {subject: 1, references:1}}).fetch());
    console.log("222222");
    ContentType.find({},{fields: {subject: 1, references:1}}).forEach(function(item){
        if (_.contains(item.references.split(","),contentType)){
            trans=item.subject;
            console.log(item);
        }
    })
    return trans;
}

Science.data.isValidDoi = function (doi) {
    if (!_.isString(doi)) return false;
    var index = doi.indexOf('/');
    if (index<=0 || index>=doi.length-1) return false;
    if(_.isEmpty(doi.slice(0,index).trim())) return false;
    if(_.isEmpty(doi.slice(index+1).trim())) return false;
    return true;
}

Science.data.getArticleDoiFromFullDOI = function (fullDOI) {
    if (!fullDOI) return "";
    if (fullDOI.indexOf("/") === -1) return fullDOI;
    var index = fullDOI.indexOf('/');
    if (index<=0 || index>=fullDOI.length-1) return fullDOI;
    var articleDOI = fullDOI.slice(index+1).trim();
    if(_.isEmpty(articleDOI)) return fullDOI;
    return articleDOI;
}