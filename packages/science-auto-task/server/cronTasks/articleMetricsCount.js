 SyncedCron.add({
     name: 'ArticlesMetrics',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.articleMetrics.rate || "at 1:30 am on Sun");//默认每周凌晨1点半检查一次
     },
     job: function () {
         var article = Articles.find({}, {fields: {_id: 1}}).fetch();
         if(article){
             article.forEach(function (article) {
                 if (!article || !article._id)return;
                 Meteor.call("getArticlePageViewsPieChartData", article._id, function (err, response) {
                     if(_.isEmpty(response))return this.ready();
                     var count = MetricsCount.find({articleId:article._id}, {fields: {_id: 1}}).fetch();
                     if(count){
                         count.forEach(function (item) {
                             MetricsCount.remove({_id:item._id});
                         });
                     }
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: response,
                         type: "1",
                         createDate:new Date()
                     });
                 });
                 Meteor.call("getArticlePageLocationReport", "fulltext", article._id, function (err, arr) {
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: arr,
                         type: "2",
                         createDate:new Date()
                     });
                 });
                 Meteor.call("getArticlePageViewsGraphData", article._id, function (err, response) {
                     if(_.isEmpty(response))return this.ready();
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: response,
                         type: "3",
                         createDate:new Date()
                     });
                 });
             });
         }
     }
 });