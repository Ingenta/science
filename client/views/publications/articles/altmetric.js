var altmetricData = new ReactiveVar();
var lastdoi;

Template.altmetric.helpers({
	imageLink:function(){
		return altmetricData.get().images.small;
	},
	url:function(){
		return altmetricData.get().details_url;
	},
	getData:function(){
		var doi  = Template.currentData().doi;
		if(doi != lastdoi){
			lastdoi=doi;
			altmetricData.set(undefined);
			if(doi){
				$.get("http://api.altmetric.com/v1/doi/"+doi,function(data){
					if(data){
						altmetricData.set(data);
					}
				})
			}
		}
		return altmetricData.get();
	}
})