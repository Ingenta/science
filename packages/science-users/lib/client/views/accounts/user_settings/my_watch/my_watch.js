Template.UserSettingsMyWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        console.log(user.watch.length);
        for(var i=0;i<user.watch.length;i++) {
            console.log(i);
            return Publications.find({"_id": user.watch[i]});
        }
    }
})

Template.SingleWatch.helpers({
    JournalUrl: function (Jourid) {
        var publication = Publications.findOne({_id:Jourid});
        var publisher = Publishers.findOne({_id: publication.publisher});
        var urls = "/publisher/"+publisher.name+"/journal/"+publication.title;
        return urls;
    }
})
