Template.ShowGuidelines.helpers({
    authorTitle: function () {
        var guideId = Router.current().params.guideId;
        var journalId = Session.get('currentJournalId');
        var guide = AuthorCenter.findOne({_id:guideId});
        if(guide){
            return AuthorCenter.find({type:guide.type,url:null,publications:journalId,parentId:null});
        }
    },
    childTitle: function () {
        return AuthorCenter.find({type:this.type,publications:this.publications,parentId:this._id});
    },
    authorCenters:function(){
        var guideId = Router.current().params.guideId;
        var gid = Session.get('guideId');
        if(gid){
            return AuthorCenter.find({_id:gid});
        }
        if(guideId){
            return AuthorCenter.find({_id:guideId});
        }

    },
    LeftTitle:function(){
        var guideId = Router.current().params.guideId;
        var guide = AuthorCenter.findOne({_id:guideId});
        var typeTitle = ["", "Submission Guidelines", "Prepare Manuscript"];
        if(guide){
            return TAPi18n.__(typeTitle[guide.type]);
        }
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