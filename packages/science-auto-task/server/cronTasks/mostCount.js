 SyncedCron.add({
     name: 'MostCount',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.Most_Count.rate || "at 1:00 am");//默认每天凌晨1点检查一次
     },
     job: function () {
         var today = moment().startOf('day').calendar();
         var month = moment().startOf('month');
         var oneWeeks = moment(month).subtract(-6, 'days').calendar();
         var twoWeeks = moment(month).subtract(-13, 'days').calendar();
         var threeWeeks = moment(month).subtract(-20, 'days').calendar();
         var fourWeeks = moment(month).subtract(-27, 'days').calendar();
         var fiveWeeks = moment(month).subtract(-24, 'days').calendar();
         if(today==oneWeeks || today==twoWeeks || today==threeWeeks || today==fourWeeks || today==fiveWeeks){
             Meteor.subscribe('insertHomeMostRead');
             var journal = Publications.find({},{fields:{shortTitle:1}});
             if(journal){
                 journal.forEach(function(journal){
                     Meteor.subscribe('insertJournalMostRead', journal._id);
                 });
             }
         }
     }
 });