//ARM接口地址
var apiUrl="https://ws.isiknowledge.com/cps/xrpc";
//要发送到接口的xml内容
var postContent = '<?xml version="1.0" encoding="UTF-8" ?><request xmlns="http://www.isinet.com/xrpc42"><fn name="LinksAMR.retrieve"><list><map><val name="username">SCP_LAMR</val><val name="password">lamr4scp</val></map><map><list name="WOS"><val>timesCited</val><val>ut</val><val>doi</val><val>pmid</val><val>sourceURL</val><val>citingArticlesURL</val><val>relatedRecordsURL</val></list></map><map><map name="cite_id0"><val name="doi">{doi}</val></map></map></list></fn></request>';

Science.Interface.WebOfScience.arm=function(doi,callback){

}