Template.secSearch.events({
	'click .btn-success':function(e){
		var searchval = Template.instance().$("#secSearchInput").val();
		console.log(searchval);
	}
})