SolrClient = Solr.createClient({
	host:"http://127.0.0.1",
	port:"8983",
	core:"/articles",
	path:"/solr"
});