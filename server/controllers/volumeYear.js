updateVolumeYear = function(){
    Publications.find().forEach(function (journal) {
        //combine all historical journals
        var idArr = [journal._id];
        var journal = Publications.findOne({_id: journal._id}, {fields: {historicalJournals: 1}});

        if (journal && !_.isEmpty(journal.historicalJournals)) {
            idArr = _.union(idArr, journal.historicalJournals)
        }
        var volumes = Volumes.find({journalId: {$in: idArr}}).fetch();
        if(!_.isEmpty(volumes)){
            volumes.forEach(function (item) {
                var issues = Issues.find({journalId: item.journalId, volume: item.volume}, {fields: {year: 1}}).fetch();
                var years = _.pluck(issues, 'year');
                years = _.uniq(years.join(", ").split(/, ?/)).sort();
                if (!_.isEmpty(years)){
                    var year = "(" + years.join(", ") + ")";
                    if(item.year != year){
                        Volumes.update({_id: item._id},{$set:{year: year}});
                    }
                }
            });
        }
    });
};