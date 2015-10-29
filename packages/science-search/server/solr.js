SolrClient = Solr.createClient({
    host: "http://" + (Meteor.isDevelopment ? "192.168.99.100" : "solr"),
    port: "8983",
    core: "/articles",
    path: "/solr"
});