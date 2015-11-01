var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
SolrClient = Solr.createClient({
    host: (isDev ? "http://192.168.99.100" : "http://solr"),
    port: "8983",
    core: "/articles",
    path: "/solr"
});