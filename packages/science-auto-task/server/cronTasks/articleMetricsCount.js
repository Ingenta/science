 SyncedCron.add({
     name: 'ArticlesMetrics',
     schedule: function (parser) {
         return parser.text(Config.AutoTasks.articleMetrics.rate || "at 1:30 am on Sat");//默认每周凌晨1点半检查一次
     },
     job: function () {
         var index = 0;
         var article = Articles.find({}, {fields: {doi: 1}}).fetch();
         if(!_.isEmpty(article)){
             article.forEach(function (article) {
                 if (!article || !article._id)return;
                 logger.info("Article to start report");
                 index++;
                 Meteor.call("getArticlePageViewsPieChartData", article._id, function (err, response) {
                     if(_.isEmpty(response))return this.ready();
                     var count = MetricsCount.find({articleId:article._id}, {fields: {_id: 1}}).fetch();
                     if(count){
                         count.forEach(function (item) {
                             MetricsCount.remove({_id:item._id});
                         });
                     }
                     logger.info("Article to remove history Aid= "+article._id);
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: response,
                         type: "1",
                         createDate:new Date()
                     });
                     logger.info("ArticlePageViews to insert P"+index);
                 });
                 Meteor.call("getArticlePageLocationReport", "fulltext", article._id, function (err, arr) {
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: arr,
                         type: "2",
                         createDate:new Date()
                     });
                     logger.info("ArticlePageLocation to insert P"+index);
                 });
                 Meteor.call("getArticlePageViewsGraphData", article._id, function (err, response) {
                     if(_.isEmpty(response))return this.ready();
                     MetricsCount.insert({
                         articleId: article._id,
                         dataCount: response,
                         type: "3",
                         createDate:new Date()
                     });
                     logger.info("ArticlePageViewsGraph to insert P"+index);
                 });
             });
         }
     }
 });