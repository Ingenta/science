moopCache = new ReactiveDict();

Template.moopDetails.helpers({
    hasMoops: function () {
        check(this.doi, String);
        check(this._id, String);
        var totalMediaForThisArticle = Collections.Medias.find({doi: this.doi}).count();
        if(!totalMediaForThisArticle)return;
        var key = "moop_" + this._id;
        Meteor.call("getMoopForArticle", this.doi, function (err, result) {
            if (!err)
                moopCache.set(key, result);
        })
        return !_.isEmpty(moopCache.get(key));
    },
    moopDatas: function () {
        return moopCache.get("moop_" + this._id);
    },
    getName: function(){
        return _.contains(Router.current().data().tabSelections,"MOOP")?TAPi18n.__("MOOP"):TAPi18n.__("Appendix")
    }
})

Template.moopDetails.events({
    'hide.bs.collapse .collapse': function (e, t) {
        e.stopPropagation();
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-minus").addClass("fa-plus");
    },
    'show.bs.collapse .collapse': function (e, t) {
        e.stopPropagation();
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-plus").addClass("fa-minus");
    }
})

Template.moopButtons.helpers({
    isCanPlay: function () {
        return this.ext == 'mp3' || this.ext == 'mp4'
    }
})

Template.moopButtons.events({
    'click .play-button': function (e) {
        e.preventDefault();
        e.stopPropagation();
        Session.set("moopFile", this);
        $('#moopModal').modal('show')
    }
})

Template.moopPlayModal.helpers({
    moopEntity: function () {
        return Session.get("moopFile");
    },
    isVideo: function () {
        return this.ext == 'mp4';
    },
    isAudio: function () {
        return this.ext == 'mp3';
    }
})

Template.moopPlayModal.events({
    'hidden.bs.modal #moopModal': function () {
        Session.set('moopFile', null);
    }
})