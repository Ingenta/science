
// Write your package code here!
if(Meteor.isServer) {
    winston = Npm.require('winston');
    MongoDBlogger = Npm.require('winston-mongodb').MongoDB;
    //set logger level to full outside of development
    var mongoOptions = {
        handleExceptions: true,
        level: 'warn',
        host: '192.168.1.10',
        db: 'meteor',
        port: 27071,
        collection: 'log',
        errorTimeout: 10000,
        timeout: 50000
    };
    winston.level = "silly";
    var isDev = (Meteor.isServer ? process.env.ROOT_URL : window.location.origin).indexOf('localhost') != -1;
    if(isDev)winston.level = "warn";
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: '/tmp/somefile.log' })
        ]
    });
    //logger.add(ScienceLog.transports.MongoDB,mongoOptions);

    //logger.error('user error connected');
    //
    //

    //logger.add(MongoDBlogger, mongoOptions);
    //logger.warn('user warning connected', {userId: userId});
    //logger.error('user error connected', {userId: userId});
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