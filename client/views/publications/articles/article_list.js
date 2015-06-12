Template.articleListTree.helpers({
    volumeList:function(journalId){
        if(journalId){
            var v= Volumes.find({'journalId':journalId},{sort:{'volume':-1}});
            return v;
        }else{
            throw new Error("Lack of query conditions， 缺少查询条件!journalId:'+journalId+'");
        }
    },
    issueList:function(journalId,volume){
        if(journalId && volume){
            var i= Issues.find({'journalId':journalId,'volume':volume},{sort:{'issue':-1}});
            console.log('journalId:'+journalId+',volume:'+volume);
            return i;
        }else{
            throw new Error("Lack of query conditions， 缺少查询条件!journalId:'+journalId+',volume:'+volume");
        }

    }
});

Template.articleListTree.events({
    "click .volume":function(event){
        $(event.target).find("span").text($(event.target).next("div").is(':visible')?'+':'-');
        $(event.target).next("div").toggle(200);
    },
    "click .issue":function(event){
        var issue=$(event.target).data().value;
        issue && Session.set("currIssue",issue);
    }
});

Template.addArticleButton.helpers({
    initPage:function(id,publisher){
        Session.set('currentJournalId',id);
        Session.set('currPublisher',publisher);
    }
});

Template.articleListRight.helpers({
    articles:function(){
        if(Config.isDevMode){
            q={};
        }else{
            var curIssue=Session.get("currIssue");
            if(!curIssue){
                var journalId=Session.get('currentJournalId');
                var lastIssue=Issues.findOne({'journalId':journalId},{sort:{'volume':-1,'issue':-1}});
                lastIssue && Session.set("currIssue",lastIssue._id) && (curIssue=lastIssue._id);
            }
            var q=curIssue?{issueId:curIssue}:{};
        }
        return Articles.find(q,{sort:{title:1}});
    }

});
Template.singleArticleInlist.helpers({
    urlToArticle:function(title){
         return Router.current().url+"/article/"+title;
    },
    getPublisherName:function(id){
        return Publishers.findOne({_id:id}).name;
    }
});


AutoForm.addHooks(['addArticleModalForm'], {

    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    },
    before:{
        insert:  function(doc){
            doc.journalId = Session.get('currentJournalId');
            doc.publisher=Session.get('currPublisher');

            if(doc.journalId){
                //此处自动生成volume记录
                var volume=Volumes.findOne({journalId:doc.journalId,volume:doc.volume});
                if(!volume){
                    volume=Volumes.insert({journalId:doc.journalId,volume:doc.volume});
                }
                doc.volumeId=volume.id || volume;

                //此处自动生成issue记录
                var issue=Issues.findOne({journalId:doc.journalId,volume:doc.volume,issue:doc.issue});
                if(!issue){
                    issue = Issues.insert({journalId:doc.journalId,volume:doc.volume,issue:doc.issue,year:doc.year,month:doc.month});
                }
                //确保article有一个关联的issue
                doc.issueId=issue.id || issue;
                if(doc && doc.journalId && doc.volumeId && doc.issueId){
                    return doc;
                }else{
                    throw new Error("article's issueId not found!");
                }
            }else{
                throw new Error("article's journalId not found!");
            }

        }
    }
}, true);
