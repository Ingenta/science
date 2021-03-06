//Template.onePublication.events({
//    'click .fa-trash': function (e) {
//        var id = this._id;
//        confirmDelete(e, function () {
//            Publications.update({_id: id}, {$set: {visible: 0}});
//        })
//    }
//});

Template.onePublication.helpers({
    getModalTitle:function(){
        return TAPi18n.__("Update");
    }
});

Template.onePublisherInFilterList.helpers({
    count: function (id) {
        var first = Session.get('pubFirstLetter');
        var q={publisher:id};
        if(!Permissions.userCan("modify-journal", "resource",this.userId))
            q.visible="1";
        if (first !== undefined)
            q.shortTitle={$regex: "^" + first, $options: "i"};
        return Publications.find(q).count();
    }
});
Template.PublicationsAlphabetBar.helpers({
    totalPublicationResults: function () {
        return Session.get('totalPublicationResults');

    },
    totalPluralPublicationResults: function () {
        var total = Session.get('totalPublicationResults');
        return pluralize(total, 'result');
    },
    letterInTheAlphabet: function () {
        return "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
    },
    select: function() {
        var num = Session.get('pubFirstLetter');
        if(num==this)
            return "select-filter";
    }
});
Template.PublicationsAlphabetBar.events({
    'click .letterFilter': function (event) {
        event.preventDefault();
        var num = $(event.target).text();
        Session.set('pubFirstLetter', num);
        Session.set('filterPublisher', undefined);
        Session.set('PerPage', 10);
    },
    'click .resetOtherFilter': function (event) {
        event.preventDefault();
        Session.set('pubFirstLetter', "other");
        Session.set('filterPublisher', undefined);
        Session.set('PerPage', 10);
    },
    'click .resetAlphabetFilter': function (event) {
        event.preventDefault();
        Session.set('pubFirstLetter', undefined);
        Session.set('PerPage', 10);
    }
})
Template.FilterList.helpers({
    publishers: function () {
        var pubId = Session.get('filterPublisher');
        if (pubId === undefined) {
            return Publishers.find();
        }
        return Publishers.find({_id: pubId});
    },
    publications: function () {
        var pubId = Session.get('filterPublisher');
        var first = Session.get('pubFirstLetter');
        var topicId = Session.get('filterTopics');
        topicId = _.isArray(topicId)?topicId:[topicId];
        var numPerPage = Session.get('PerPage') || 10;
        var q = {};
        if(!Permissions.userCan("modify-journal", "resource",this.userId))
            q.visible="1";
        pubId && (q.publisher = pubId);
        var reg;
        if (first && first == "other") {
            reg = "[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex: reg, $options: "i"});
        if(!_.isEmpty(_.compact(topicId))){
            q.topicId={$in:topicId}
        }
        Session.set("totalPublicationResults", Publications.find(q).count());
        if(TAPi18n.getLanguage() === "en")return myPubPagination.find(q, {itemsPerPage: numPerPage, sort: {title: 1}});
        return myPubPagination.find(q, {itemsPerPage: numPerPage, sort: {title: 1}});
    },
    selectedPublisher: function () {
        return Session.get('filterPublisher');
    },
    unionTopics:function(){
        var journals=Publications.find({},{fields:{topicId:1}}).fetch();
        var topics = _.uniq(_.compact(_.flatten(_.pluck(journals,"topicId"))));
        return Topics.find({_id:{$in:topics}});
    },
    countOfTopic:function(){
        return Publications.find({topicId:this._id}).count();
    },
    selectedTopics:function(){
        return Session.get('filterTopics');
    },
    ftClass:function(){
        return _.contains(Session.get('filterTopics'),this._id)?"filter-selected":"";
    },
    filterPublicationPageCount: function () {
        var pubId = Session.get('filterPublisher');
        var first = Session.get('pubFirstLetter');
        var topicId = Session.get('filterTopics');
        topicId = _.isArray(topicId) ? topicId : [topicId];
        var q = {};
        if (!Permissions.userCan("modify-journal", "resource", this.userId))
            q.visible = "1";
        pubId && (q.publisher = pubId);
        var reg;
        if (first && first == "other") {
            reg = "[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex: reg, $options: "i"});
        if (!_.isEmpty(_.compact(topicId))) {
            q.topicId = {$in: topicId}
        }
        return Publications.find(q).count()>10;
    }
});

Template.FilterList.events({
    'click .filterPublisherButton': function (event) {
        var f = $(event.target).data().id;
        Session.set('filterPublisher', f);
        Session.set('PerPage', 10);
    },
    'click .filterTopicButton': function (event) {
        var f = $(event.target).data().id;
        var ft=Session.get('filterTopics')||[];
        if(_.contains(ft,f)){
            ft= _.without(ft,f);
        }else{
            ft.push(f);
        }
        Session.set('filterTopics', ft);
        Session.set('PerPage', 10);
    },
    'click .clearPublisher': function (event) {
        Session.set('filterPublisher', undefined);
        Session.set('PerPage', 10);
    }
});
Template.FilterList.onRendered(function () {
    Session.set('filterPublisher', undefined);
    Session.set('pubFirstLetter', undefined);
    Session.set('filterTopics',undefined);
    Session.set('PerPage', 10);
});
