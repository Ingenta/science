Template.UserSettingsMyFavorite.helpers({
    favorite : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        var i;
        for(i=0;i<=user.favorite.length;i++) {
            return Articles.find({"_id": user.favorite[i]});
        }
    }
})

Template.SingleFavorite.helpers({
    ArticleUrl: function (Arid) {
        var article = Articles.findOne({_id:Arid});
        var publication = Publications.findOne({_id:article.journalId});
        var publisher = Publishers.findOne({_id: publication.publisher});
        var urls = "/publisher/"+publisher.name+"/journal/"+publication.title+"/"+article.volume+"/"+article.issue+"/"+article.doi;
        return urls;
    }
})