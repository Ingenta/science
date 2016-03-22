ScienceXML.IssueCreator = function () {
    var gen = function (obj) {
        return "j:" + obj.journalId + ",v:" + obj.volume + ",i:" + obj.issue;
    };
    var tasks = new Science.JSON.UniqueList(gen);

    this.createIssue = function (obj) {
        if (obj.journalId && obj.volume && obj.issue) {
            if (!tasks.exists(obj)) {
                tasks.push(obj);
                Volumes.upsert({journalId: obj.journalId, volume: obj.volume}, {
                    journalId: obj.journalId,
                    volume: obj.volume
                });
                var volume = Volumes.findOne({journalId: obj.journalId, volume: obj.volume})._id;
                var issue = Issues.findOne({journalId: obj.journalId, volume: obj.volume, issue: obj.issue});
                if (issue && issue._id) {
                    if(issue.year && issue.year.indexOf(obj.year)==-1){
                        issue.year= _.union(issue.year.split(/, ?/),obj.year).sort().join(', ');
                        Issues.update({_id:issue._id},{$set:{year:issue.year}})
                    }
                } else {
                    issue=Issues.insert({
                        journalId: obj.journalId,
                        volume: obj.volume,
                        issue: obj.issue,
                        year: obj.year,
                        month: obj.month,
                        order: a.year+Science.String.PadLeft(a.volume,"0",4)+Science.String.PadLeft(a.issue,"0",4),
                        createDate: new Date()
                    })
                }
                return {
                    journalId: obj.journalId,
                    volumeId: volume,
                    issueId: issue && issue._id || issue,
                    volume: obj.volume,
                    issue: obj.issue
                };
            } else {
                var volume = Volumes.findOne({journalId: obj.journalId, volume: obj.volume});
                var issue = Issues.findOne({journalId: obj.journalId, volume: obj.volume, issue: obj.issue});
                if(issue.year && issue.year.indexOf(obj.year)==-1){
                    issue.year= _.union(issue.year.split(/, ?/),obj.year).sort().join(', ');
                    Issues.update({_id:issue._id},{$set:{year:issue.year}})
                }
                return {
                    journalId: obj.journalId,
                    volumeId: volume,
                    issueId: issue,
                    volume: obj.volume,
                    issue: obj.issue
                };
            }
        }
    }
}

ScienceXML.testIssueCreator = function (countOfIssue) {
    var issueCreator = new ScienceXML.IssueCreator();
    var journalArr = ["a", "b"];
    var randomNumber = function (max) {
        return String(Math.floor(Math.random() * max))
    };
    var randomVI = function (count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            var params = {
                journalId: journalArr[randomNumber(journalArr.length)],
                volume: randomNumber(12),
                issue: randomNumber(24),
                year: randomNumber(10) + 2000
            };
            result.push({input: params, output: issueCreator.createIssue(params)})
        }
        return result;
    }
    var results = randomVI(countOfIssue);
    var groupInput = _.groupBy(_.pluck(results, "input"), function (p) {
        return p.journalId + "-" + p.volume + "-" + p.issue;
    });
    _.each(groupInput, function (val, key) {
        groupInput[key] = val.length;
    })
    var groupOut = _.groupBy(_.pluck(results, "output"), function (p) {
        return p.journalId + "-" + p.volume + "-" + p.issue + "-" + p.volumeId + "-" + p.issueId;
    });
    _.each(groupOut, function (val, key) {
        groupOut[key] = val.length;
    })
    console.log(_.size(groupInput) === _.size(groupOut) ? "数量相同" : "数量不相同");
    Volumes.remove({journalId: {$in: journalArr}});
    Issues.remove({journalId: {$in: journalArr}});
    return {input: groupInput, output: groupOut};
}