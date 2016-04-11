//黄延红说注册doi的工作应该在导入新数据时,而不是在这里.
//TODO: 确认新的注册流程后开发相应功能
//SyncedCron.add({
//    name: 'DOIRegister',
//    schedule: function (parser) {
//        return parser.text(Config.AutoTasks.DOI_Register.rate || "at 1:00 am");//默认每天凌晨1点执行
//    },
//    job: function () {
//        var taskId = AutoTasks.insert({type: "doi_register", status: "creating", createOn: new Date()});
//        Science.Interface.CrossRef.register({
//            taskId: taskId,
//            recvEmail: Config.AutoTasks.DOI_Register.recvEmail,
//            rootUrl: Config.AutoTasks.DOI_Register.rootUrl,
//            condition: Config.AutoTasks.DOI_Register.condition
//        });
//    }
//});