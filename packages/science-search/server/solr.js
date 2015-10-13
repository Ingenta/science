SolrClient = Solr.createClient({
	host: "http://" + (process.env.SOLR_PORT_8983_TCP_ADDR || "192.168.99.100"),
	port:"8983",
	core:"/articles",
	path:"/solr"
});