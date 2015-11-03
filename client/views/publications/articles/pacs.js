Template.pacsTemplate.helpers({
	'pacsSearchlink':function(){
		var option = {
			filterQuery:{
				pacsCodes:[this.pacsCode]
			}
		};
		return SolrQuery.makeUrl(option);
	}
})