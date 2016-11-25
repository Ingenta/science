 SyncedCron.add({
     name: 'MostCount',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.Most_Count.rate || "at 1:00 am on Sun");//默认每天周日凌晨1点检查一次
     },
     job: function () {
             Meteor.subscribe('insertHomeMostRead');
             var journal = Publications.find({},{fields:{shortTitle:1}});
             if(journal){
                 journal.forEach(function(journal){
                     Meteor.subscribe('insertJournalMostRead', journal._id);
                 });
             }
     }
 });