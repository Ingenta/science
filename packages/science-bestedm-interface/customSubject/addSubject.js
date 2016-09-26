Bestedm.Customer.Subject.add = function(subjectInfo,callback){
    var customerConfig = Config.bestedmInfo.apiList.customer;
    BestedmHelper.post(customerConfig.url+"?do="+customerConfig.doList.subject.add,subjectInfo,callback)
}