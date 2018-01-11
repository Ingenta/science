 SyncedCron.add({
     name: 'MostCount',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.Most_Count.rate || "at 1:00 am on Sun");//默认每天周日凌晨1点检查一次
     },
     job: function () {
             Meteor.call("getMostRead", undefined, 20, function (err, result) {
                 if(_.isEmpty(result))return this.ready();
                 var homeMostRead = MostCount.find({type:"homeMostRead"}, {fields: {_id: 1}}).fetch();
                 if(homeMostRead){
                     homeMostRead.forEach(function (item) {
                         MostCount.remove({_id:item._id});
                     });
                 }
                 MostCount.insert({ArticlesId:result, type:"homeMostRead", createDate:new Date()});
             });
             var journal = Publications.find({},{fields:{shortTitle:1}});
             if(journal){
                 journal.forEach(function(journal){
                     Meteor.call("getMostRead", journal._id, 20, function (err, result) {
                         if(_.isEmpty(result))return this.ready();
                         var journalMostRead = MostCount.find({type:"journalMostRead",journalId:journal._id}, {fields: {_id: 1}}).fetch();
                         if(journalMostRead){
                             journalMostRead.forEach(function (item) {
                                 MostCount.remove({_id:item._id});
                             });
                         }
                         MostCount.insert({ArticlesId:result, journalId:journal._id, type:"journalMostRead", createDate:new Date()});
                     });
                 });
             }
     }
 });