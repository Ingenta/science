 SyncedCron.add({
     name: 'MostCount',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.Most_Count.rate || "at 1:00 am on Sun");//默认每天周日凌晨1点检查一次
     },
     job: function () {
             Meteor.call("getMostRead", undefined, 20, function (err, result) {
                 if(_.isEmpty(result))return this.ready();
                 var mostRead = MostCount.findOne({type:"homeMostRead"},{sort:{createDate:-1}});
                 if(mostRead===undefined || _.difference(mostRead.ArticlesId,result).length > 0){
                     MostCount.insert({ArticlesId:result, type:"homeMostRead", createDate:new Date()});
                 }
             });
             var journal = Publications.find({},{fields:{shortTitle:1}});
             if(journal){
                 journal.forEach(function(journal){
                     Meteor.call("getMostRead", journal._id, 20, function (err, result) {
                         if(_.isEmpty(result))return this.ready();
                         var mostRead = MostCount.findOne({type:"journalMostRead",journalId:journal._id},{sort:{createDate:-1}});
                         if(mostRead===undefined || _.difference(mostRead.ArticlesId,result).length > 0){
                             MostCount.insert({ArticlesId:result, journalId:journal._id, type:"journalMostRead", createDate:new Date()});
                         }
                     });
                 });
             }
     }
 });