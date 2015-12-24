Template.ShowGuidelines.helpers({
    authorTitle: function () {
        var guideId = Router.current().params.guideId;
        var journalId = Session.get('currentJournalId');
        var guide = AuthorCenter.findOne({_id:guideId});
        return AuthorCenter.find({type:guide.type,url:null,publications:journalId});
    },
    authorCenters:function(){
        var guideId = Router.current().params.guideId;
        var gid = Session.get('guideId');
        if(gid){
            return AuthorCenter.find({_id:gid});
        }
        return AuthorCenter.find({_id:guideId});

    },
    LeftTitle:function(){
        var guideId = Router.current().params.guideId;
        var guide = AuthorCenter.findOne({_id:guideId});
        if(guide.type==="1"){
            var iscn=TAPi18n.getLanguage()==='zh-CN';
            var name = iscn?"投稿前须知":"Submission Guidelines";
            return name;
        }
        if(guide.type==="2"){
            var iscn=TAPi18n.getLanguage()==='zh-CN';
            var name = iscn?"准备手稿":"Prepare Manuscript";
            return name;
        }
        return null;
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