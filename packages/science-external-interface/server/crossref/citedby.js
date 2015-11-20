var apiUrl = "https://doi.crossref.org/servlet/getForwardLinks?" +
	"usr=scichina&pwd=scichina1&startDate=1990-01-01&" +
	"endDate=" + new Date().format("yyyy-MM-dd") + "&doi=";

Science.Interface.CrossRef.getCitedBy = function (doi, callback) {
	Science.Request.get(apiUrl + doi, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			if (body.length > 460) {
				var xmlDom  = new Science.Dom().parseFromString(body);
				var bodystr = xmlDom.documentElement.getElementsByTagName('body')[0].toString();
				xmlDom      = new Science.Dom().parseFromString(bodystr);//ok, i know it's bad way, we will make it's
			                                                             // better at future；
				var journalCite = Science.XPath.select("//journal_cite", xmlDom);
				var result      = [];
				_.each(journalCite, function (item) {
					var jc               = {journal: {}, issn: {}, contributors: []};
					jc.journal.title     = Science.XPath.select("child::journal_title/text()", item).toString();
					jc.journal.abbr      = Science.XPath.select("child::journal_abbreviation/text()", item).toString();
					jc.articleTitle     = Science.XPath.select("child::article_title/text()", item).toString();
					jc.issn.print        = Science.XPath.select("child::issn[type='print']/text()", item).toString();
					jc.issn.electronic   = Science.XPath.select("child::issn[type='electronic']/text()", item).toString();
					var contributorNodes = Science.XPath.select("child::contributors/contributor", item);
					_.each(contributorNodes, function (cnode) {
						var contributor           = {};
						contributor.surname       = Science.XPath.select("child::surname/text()", cnode).toString();
						contributor.givenName     = Science.XPath.select("child::given_name/text()", cnode).toString();
						contributor.isFristAuthor = cnode.getAttribute('first-author');
						contributor.sequence      = cnode.getAttribute('sequence');
						jc.contributors.push(contributor);
					});
					jc.volume            = Science.XPath.select("child::volume/text()", item).toString();
					jc.issue             = Science.XPath.select("child::issue/text()", item).toString();
					jc.firstPage         = Science.XPath.select("child::first_page/text()", item).toString();
					jc.doi               = Science.XPath.select("child::doi/text()", item).toString();
					result.push(jc);
				})
				callback(null, result);
				return;
			}
		}
		callback('some thing wrong');
	});
}

//Meteor.startup(function () {
//	Science.Interface.CrossRef.getCitedBy("10.1360/972010-666", function (err, obj) {
//		if (!err && obj) {
//			_.each(obj, function (item) {
//				console.dir(item)
//			})
//		}
//	});
//})