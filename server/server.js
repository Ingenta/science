Meteor.startup(function () {
    // read environment variables from Meteor.settings
    if (Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
        for (var variableName in Meteor.settings.env) {
            process.env[variableName] = Meteor.settings.env[variableName];
        }
    }
    if(Spiderable ){
        Spiderable.cacheLifetimeInMinutes = 1320;
        if( _.isArray(Spiderable.userAgentRegExps)){
            Spiderable.userAgentRegExps.push(/baiduspider/i);
            Spiderable.userAgentRegExps.push(/bingbot/i);
        }
    }
});