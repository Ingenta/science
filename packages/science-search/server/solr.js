SolrClient = Solr.createClient({
	host:"http://192.168.1.10",
	port:"8983",
	core:"/articles",
	path:"/solr"
});