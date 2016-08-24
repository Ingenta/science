//ARM接口地址
var apiUrl="https://ws.isiknowledge.com/cps/xrpc";
//要发送到接口的xml内容
var postContent = '<?xml version="1.0" encoding="UTF-8" ?><request xmlns="http://www.isinet.com/xrpc42"><fn name="LinksAMR.retrieve"><list><map><val name="username">SCP_LAMR</val><val name="password">lamr4scp</val></map><map><list name="WOS"><val>timesCited</val><val>ut</val><val>doi</val><val>pmid</val><val>sourceURL</val><val>citingArticlesURL</val><val>relatedRecordsURL</val></list></map><map><map name="cite_id0"><val name="doi">{doi}</val></map></map></list></fn></request>';

var parserHelper = Science.XPath.ParseHelper;

Science.Interface.WebOfScience.amr=function(doi,callback){
    if(!doi || !callback){
        logger.error('call AMR failed, cause doi or callback is missing!');
        return;
    }

    Science.Request.post({url:apiUrl, body: postContent.replace('{doi}',doi)}, function(err, httpResponse, body) {
        if (err) {
            logger.error('call AMR failed:', err);
            callback(err);
            return;
        }
        var doc = new Science.Dom().parseFromString(body.replace(/ xmlns[^>]+/,""));
        var citedInfo={};
        citedInfo.relatedRecordsUrl=parserHelper.getSimpleVal("//val[@name='relatedRecordsURL']",doc);
        citedInfo.sourceUrl = parserHelper.getSimpleVal("//val[@name='sourceURL']",doc);
        citedInfo.timesCited=parserHelper.getSimpleVal("//val[@name='timesCited']",doc);
        citedInfo.ut=parserHelper.getSimpleVal("//val[@name='ut']",doc);
        citedInfo.doi=parserHelper.getSimpleVal("//val[@name='doi']",doc);
        citedInfo.citingArticlesUrl=parserHelper.getSimpleVal("//val[@name='citingArticlesURL']",doc);
        callback(null, citedInfo);
    });
}