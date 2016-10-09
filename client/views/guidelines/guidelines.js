Template.ShowGuidelines.helpers({
    authorCenters:function(){
        var guideId = Router.current().params.guideId;
        var gid = Session.get('guideId');
        if(gid){
            return AuthorCenter.find({_id:gid},{fields: {title: 1,content: 1}});
        }
        if(guideId){
            return AuthorCenter.find({_id:guideId},{fields: {title: 1,content: 1}});
        }
    },
    columnName:function(){
        var guideId = Router.current().params.guideId;
        var guide = AuthorCenter.findOne({_id:guideId});
        var typeTitle = ["", "Submission Guidelines", "Prepare Manuscript","Submit  Manuscript"];
        if(guide){
            return TAPi18n.__(typeTitle[guide.type]);
        }
    },
    authorTitle: function () {
        var guideId = Router.current().params.guideId;
        var journalId = Session.get('currentJournalId');
        var guide = AuthorCenter.findOne({_id:guideId});
        if(guide){
            return AuthorCenter.find({type:guide.type, publications:journalId, parentId:null, url:null},{fields: {title: 1,type: 1}});
        }
    },
    childTitle: function () {
        var journalId = Session.get('currentJournalId');
        return AuthorCenter.find({type:this.type, publications:journalId, parentId:this._id},{fields: {title: 1}});
    }
});

Template.ShowGuidelines.events({
    'click .leftButton': function (event) {
        var guides = $(event.target).data().guideid;
        Session.set('guideId', guides);
    },
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            AuthorCenter.remove({_id:id});
        })
    }
});