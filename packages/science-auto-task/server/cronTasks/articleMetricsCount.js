 SyncedCron.add({
     name: 'ArticlesMetrics',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.articleMetrics.rate || "at 1:30 am");//默认每天凌晨1点半检查一次
     },
     job: function () {
         var article = Articles.find({}, {fields: {_id: 1}}).fetch();
         if(article){
             article.forEach(function (article) {
                 if (!article || !article._id)return;
                 Meteor.call("getArticlePageViewsPieChartData", article._id, function (err, response) {
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
                     var data = new Array();
                     var index = 0;
                     _.each(arr, function (obj) {
                         index++;
                         if (obj.name) {
                             data.push({
                                 name: TAPi18n.getLanguage() === "zh-CN" ? obj.name.cn : obj.name.en,
                                 y: obj.locationCount
                             });
                         }
                     });
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: data,
                         type: "2",
                         createDate:new Date()
                     });
                 });
                 Meteor.call("getArticlePageViewsGraphData", article._id, function (err, response) {
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