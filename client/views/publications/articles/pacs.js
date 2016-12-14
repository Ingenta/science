Template.pacsTemplate.helpers({
	'pacsSearchlink':function(){
		var option = {
			filterQuery:{
				pacsCodes:[this.pacsCode]
			}
		};
		return SolrQuery.makeUrl(option);
	}
});

Template.pacsTemplate.events({
	'hide.bs.collapse .collapse':function(e,t){
		e.stopPropagation();
		$(e.currentTarget).siblings('p').find("i").removeClass("fa-minus").addClass("fa-plus");
	},
	'show.bs.collapse .collapse':function(e,t){
		e.stopPropagation();
		$(e.currentTarget).siblings('p').find("i").removeClass("fa-plus").addClass("fa-minus");
	}
});

