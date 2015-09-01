var apiUrl = "https://doi.crossref.org/servlet/getForwardLinks?" +
	"usr=scichina&pwd=scichina1&startDate=1990-01-01&" +
	"endDate=" + new Date().format("yyyy-MM-dd") + "&doi=";

Science.CrossRef.getCitedBy = function(doi,callback){
	Science.Request(apiUrl+doi,function(err,response,body){
		if (!err && response.statusCode == 200) {
			if(body.length>460){
				var xmlDom = new Science.Dom().parseFromString(body);
				Science.XPath.selectAsJson('//body',xmlDom,function(obj){
					console.dir(obj);
				});
				debugger;
			}
		}
	});
}

Meteor.startup(function(){
	Science.CrossRef.getCitedBy("10.1360/972010-666",function(obj){
		return ;
	});
})