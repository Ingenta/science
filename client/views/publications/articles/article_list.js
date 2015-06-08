Template.articleListTree.helpers({
    volumeList:function(journalId){
        Meteor.call('distinctVolume',journalId,function(err,result){
            if(err){
                throw err;
            }else{
                if(result){
                    var volList=new Array(result.length);
                    $.each(result,function(i,item){
                        volList[i]={volume:item.toString(),journalId:journalId};
                    })
                    Session.set('volumeList',volList);
                    console.log(volList);
                }
            }
        });
        return Session.get('volumeList');
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
        var curIssue=Session.get("currIssue");
        return curIssue? Articles.find({issueId:curIssue},{sort:{title:1}}):null;
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
            //此处自动生成issue记录
            if(doc.journalId){
                var issue=Issues.findOne({journalId:doc.journalId,volume:doc.volume,issue:doc.issue});
                if(!issue){
                    issue = Issues.insert({journalId:doc.journalId,volume:doc.volume,issue:doc.issue,year:doc.year,month:doc.month});
                }
                //确保article有一个关联的issue
                doc.issueId=issue.id || issue;
                if(doc && doc.journalId && doc.issueId){
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