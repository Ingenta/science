var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
var host = isDev ? "http://192.168.1.10" : "http://solr";
if (process.env.SOLR_URL)
    host = process.env.SOLR_URL;
SolrClient = Solr.createClient({
    host: host,
    port: "8983",
    core: "/articles",
    path: "/solr"
});