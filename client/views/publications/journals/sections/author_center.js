Template.publicationPdfContent.helpers({
    authorResources: function () {
        var journalId = Session.get('currentJournalId');
        return Publications.find({_id:journalId});
    },
    pdfValue:function(){
        if(this.fileId===undefined){
            return null;
        }
        var file = Collections.JournalMediaFileStore.findOne({_id:this.fileId});
        return file.url()+"&download=true";
    }
});

Template.guideArticles.helpers({
    instructions: function () {
        var journalId = Session.get('currentJournalId');
        return AuthorCenter.find({type:"1",publications:journalId});
    },
    manuscript: function () {
        var journalId = Session.get('currentJournalId');
        return AuthorCenter.find({type:"2",publications:journalId,parentId:null});
    },
    childList: function () {
        var journalId = Session.get('currentJournalId');
        return AuthorCenter.find({type:"2",publications:journalId,parentId:this._id});
    },
    submitManuscript: function () {
        var journalId = Session.get('currentJournalId');
        return AuthorCenter.find({type:"3",publications:journalId});
    },
    whichUrl: function() {
        if(this.url){
            return this.url;
        }
        var journalId = Session.get('currentJournalId');
        var publication = Publications.findOne({_id:journalId});
        return publication.title+"/guide/"+this._id;
    }
});

Template.addManuscriptModalForm.helpers({
    getManuscript:function(){
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type:"2",publications:journalId,parentId:null}).fetch();
        var result = [];
        _.each(articles,function(item){
            var name = iscn?item.title.cn:item.title.en;
            result.push({label:name,value:item._id});
        });
        return result;
    }
});

Template.updateManuscriptModalForm.helpers({
    getManuscript:function(){
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type:"2",publications:journalId,parentId:null}).fetch();
        var result = [];
        _.each(articles,function(item){
            var name = iscn?item.title.cn:item.title.en;
            result.push({label:name,value:item._id});
        });
        return result;
    }
});

Template.authorArticlesHistory.events({
    'click #searchAuthor': function () {
        var name = $('#authorName').val();
        var company = $('#affiliation').val();
        var query = [];
        var flag=false;
        if(name){
            query.push({key:"author",val:name});
            flag=true;
        }
        if(company){
            var p = {key:"affiliation",val:company};
            if(flag){
                p.logicRelation="AND";
            }
            query.push(p);
            flag=true;
        }
        SolrQuery.search({query:query});
    }
});

AutoForm.addHooks(['addInstructionsModalForm'], {
    onSuccess: function () {
        $("#addInstructionsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.type = "1";
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addManuscriptModalForm'], {
    onSuccess: function () {
        $("#addManuscriptModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.type = "2";
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addSubmitManuscriptModalForm'], {
    onSuccess: function () {
        $("#addSubmitManuscriptModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.type = "3";
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);
