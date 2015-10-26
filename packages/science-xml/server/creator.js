ScienceXML.IssueCreator = function () {
	var gen   = function (obj) {
		return "j:" + obj.journalId + ",v:" + obj.volume + ",i:" + obj.issue;
	};
	var tasks = new Science.JSON.UniqueList(gen);

	this.createIssue = function (obj) {
		if (obj.journalId && obj.volume && obj.issue) {
			if (!tasks.exists(obj)) {
				tasks.push(obj);
				var volume = Volumes.findOne({journalId: obj.journalId, volume: obj.volume});
				volume     = (volume && volume._id) || Volumes.insert({journalId: obj.journalId, volume: obj.volume})

				var issue = Issues.findOne({journalId: obj.journalId, volume: obj.volume, issue: obj.issue});
				issue     = (issue && issue._id) || Issues.insert({
						journalId: obj.journalId,
						volume   : obj.volume,
						issue    : obj.issue,
						year     : obj.year,
						month    : obj.month || "01",
						createDate: new Date()
					})

				return {volumeId: volume, issueId: issue};
			}
		}
	}
}