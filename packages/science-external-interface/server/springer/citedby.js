var apiUrl = "http://citationsapi.nkb3.org/article/citations?&s=1&p=100000&doi=";

Science.Interface.Springer.getCitedBy = function (doi, callback) {
	Science.Request.get(apiUrl + doi, function (err, response, body) {
		if (!err && response.statusCode == 200) {

				var xmlDom  = new Science.Dom().parseFromString(body);
				var journalCite = Science.XPath.select("//journal_cite", xmlDom);
				var result      = [];
				_.each(journalCite, function (item) {
					var jc               = {journal: {}, issn: {}, contributors: []};
					jc.journal.title     = Science.XPath.select("child::journal_title/text()", item).toString();
					jc.journal.abbr      = Science.XPath.select("child::journal_abbreviation/text()", item).toString();
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

		callback('some thing wrong');
	});
};

//Meteor.startup(function () {
//	Science.Interface.Springer.getCitedBy("10.1007/s11433-009-0247-2", function (err, obj) {
//		if (!err && obj) {
//			_.each(obj, function (item) {
//				console.dir(item)
//			})
//		}
//	});
//})