var altmetricData = new ReactiveVar();

Template.altmetric.onCreated(function(){
	var doi  = Template.currentData().doi;
	console.log(doi);
	if(doi){
		$.get("http://api.altmetric.com/v1/doi/"+doi,function(data){
			if(data){
				altmetricData.set( data);
			}
		})
	}
})

Template.altmetric.helpers({
	imageLink:function(){
		return altmetricData.get().images.small;
	},
	url:function(){
		return altmetricData.get().details_url;
	},
	getData:function(){
		return altmetricData.get();
	}
})