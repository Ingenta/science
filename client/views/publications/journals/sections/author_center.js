Template.publicationPdfContent.helpers({
    authorResources: function () {
        var journalId = Session.get('currentJournalId');
        return Publications.find({_id: journalId});
    },
    pdfValue: function () {
        if (!this.fileId)return;
        var file = Collections.JournalMediaFileStore.findOne({_id: this.fileId});
        if (!file)return;
        return CDN.get_cdn_url() + file.url({auth:false});
    }
});

Template.guideArticles.helpers({
    instructions: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "1", publications: journalId, parentId: null});
    },
    childInstructionsList: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "1", publications: journalId, parentId: this._id});
    },
    manuscript: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "2", publications: journalId, parentId: null});
    },
    childManuscriptList: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "2", publications: journalId, parentId: this._id});
    },
    submitManuscript: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "3", publications: journalId, parentId: null});
    },
    childSubmitManuscriptList: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "3", publications: journalId, parentId: this._id});
    },
    whichUrl: function () {
        if (this.url)return this.url;
        var journalId = Session.get('currentJournalId');
        if(journalId){
            var publication = Publications.findOne({_id: journalId});
            if(publication)return publication.shortTitle + "/guide/Manuscript/" + this._id;
        }
    },
    childInstructionsListCount: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "1", publications: journalId, parentId: this._id}).count()>0;
    },
    childManuscriptListCount: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "2", publications: journalId, parentId: this._id}).count()>0;
    },
    childSubmitManuscriptListCount: function () {
        var journalId = Session.get('currentJournalId');
        if(journalId)return AuthorCenter.find({type: "3", publications: journalId, parentId: this._id}).count()>0;
    }
});

Template.authorArticlesHistory.events({
    'click #searchAuthor': function () {
        var name = $('#authorName').val();
        var company = $('#affiliation').val();
        var query = [];
        var flag = false;
        if (name) {
            query.push({key: "author", val: name});
            flag = true;
        }
        if (company) {
            var p = {key: "affiliation", val: company};
            if (flag) {
                p.logicRelation = "AND";
            }
            query.push(p);
            flag = true;
        }
        SolrQuery.search({query: query});
    }
});

Template.guideArticles.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            AuthorCenter.remove({_id: id});
        })
    }
});

Template.addInstructionsModalForm.helpers({
    getManuscript: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type: "1", publications: journalId, parentId: null}).fetch();
        var result = [];
        _.each(articles, function (item) {
            if (item && item.title && item.title.cn) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
    }
});

Template.addManuscriptModalForm.helpers({
    getManuscript: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type: "2", publications: journalId, parentId: null}).fetch();
        var result = [];
        _.each(articles, function (item) {
            if (item && item.title && item.title.cn) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
    }
});

Template.addSubmitManuscriptModalForm.helpers({
    getManuscript: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type: "3", publications: journalId, parentId: null}).fetch();
        var result = [];
        _.each(articles, function (item) {
            if (item && item.title && item.title.cn) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
    }
});

Template.updateInstructionsModalForm.helpers({
    getManuscript: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type: "1", publications: journalId, parentId: null}).fetch();
        var result = [];
        _.each(articles, function (item) {
            if (item && item.title && item.title.cn) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
    }
});

Template.updateManuscriptModalForm.helpers({
    getManuscript: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type: "2", publications: journalId, parentId: null}).fetch();
        var result = [];
        _.each(articles, function (item) {
            if (item && item.title && item.title.cn) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
    }
});

Template.updateSubmitManuscriptModalForm.helpers({
    getManuscript: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = AuthorCenter.find({type: "3", publications: journalId, parentId: null}).fetch();
        var result = [];
        _.each(articles, function (item) {
            if (item && item.title && item.title.cn) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
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
