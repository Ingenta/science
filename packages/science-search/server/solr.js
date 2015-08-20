SolrClient = Solr.createClient({
	host:"http://192.168.99.100",
	port:"8983",
	core:"/articles",
	path:"/solr"
});