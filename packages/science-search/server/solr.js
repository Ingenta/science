var localDevServer = process.env.DOCKER_URL ? process.env.DOCKER_URL : "http://192.168.1.10"
var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
var host = isDev ? localDevServer : "http://solr";
SolrClient = Solr.createClient({
    host: host,
    port: "8983",
    core: "/articles",
    path: "/solr"
});