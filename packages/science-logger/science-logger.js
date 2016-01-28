developmentLogLevel = "info";
productionLogLevel = "silly";
// Write your package code here!
if (Meteor.isServer) {
    winston = Npm.require('winston');
    MongoDBlogger = Npm.require('winston-mongodb').MongoDB;

    winston.level = productionLogLevel;
    var isDev = (Meteor.isServer ? process.env.ROOT_URL : window.location.origin).indexOf('localhost') != -1;
    if (isDev)winston.level = developmentLogLevel;
    //only log warnings and errors to mongo
    var mongoOptions = {
        handleExceptions: true,
        level: "warn",
        //host: '192.168.1.10',
        db: process.env.MONGO_URL,
        port: 27071,
        collection: 'log',
        errorTimeout: 10000,
        timeout: 50000
    };
    var fileDebugOptions = {
        silent: false,
        colorize: true,
        timestamp: true,
        maxFiles: 5,
        json: true,
        filename: '/tmp/debug.log',
        level: winston.level,
        maxsize: 500000
    };
    var fileExceptionOptions = {
        silent: false,
        colorize: false,
        timestamp: true,
        filename: '/tmp/exception.log',
        maxsize: 500000,
        maxFiles: 5,
        json: true
    };
    if (isDev){
        logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(),
            ],
            exceptionHandlers: [
                new (winston.transports.Console)()
            ]
        });
    }
    else {
        logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)(fileDebugOptions),
                new (winston.transports.MongoDB)(mongoOptions)
            ],
            exceptionHandlers: [
                new (winston.transports.Console)(),
                new (winston.transports.File)(fileExceptionOptions)
            ]
        });
    }
    //Meteor.publish('user', function() {
    //    var userId = this.userId;
    //    logger.info('user connected', {userId: userId});
    //
    //    this.ready();
    //    this.onStop(function() {
    //        logger.info('user disconnected', {userId: userId});
    //    });
    //});
}

//if(Meteor.isClient) {
//    Meteor.subscribe('user');
//}