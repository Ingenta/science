ReactiveTabs.createInterface({
    template: 'watchTabs'
});

Template.watchOptions.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Article Watch"), slug: 'article'},
            {name: TAPi18n.__("Journal Watch"), slug: 'journal'},
            {name: TAPi18n.__("Topic Watch"), slug: 'topic'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});
Template.UserSettingsMyWatch.onRendered(function () {
    var freq = Meteor.user().emailFrequency;
    if (!freq)freq = "off";
    $('#' + freq).click();
})
Template.UserSettingsMyWatch.events({
    "change .emailFrequencyButtons": function (e) {
        if (Meteor.user().emailFrequency !== e.target.id){
            if(e.target.id === 'off') Users.update(Meteor.userId(), {$unset: {emailFrequency: ''}});
            else Users.update(Meteor.userId(), {$set: {emailFrequency: e.target.id}})
        }
    }
})