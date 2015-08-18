Template.newContent.events({
    'click .activeButton': function (event) {
        var idValue = $(event.target).data().topicstid;
        Session.set('tabNews', idValue);
    }
});