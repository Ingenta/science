ReactiveTabs.createInterface({
    template: 'articleTabs',
    onChange: function (slug, template) {
        if(slug==='abstract'){
            CountArticle.insert({
                articleId: this._id,
                userId: Meteor.userId(),
                when: new Date(),
                action: "abstract"
            })
        }else if(slug === 'full text'){
            CountArticle.insert({
                articleId: this._id,
                userId: Meteor.userId(),
                when: new Date(),
                action: "fulltext"
            })
        }
    }
});

Template.showArticle.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        return this.surname + ' ' + this.given;
    }
});

Template.articleOptions.helpers({
    context: function () {
        var currentTitle = Router.current().params.articleName;
        return Articles.findOne({title: currentTitle});
    }
});

Template.articleOptions.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Abstract"), slug: 'abstract'},
            {name: TAPi18n.__("Full Text"), slug: 'full text'},
            {name: TAPi18n.__("References") + "(" + this.references.length + ")", slug: 'references'},
            {name: TAPi18n.__("Cited By"), slug: 'cited by'},
            {name: TAPi18n.__("Data & Media"), slug: 'data media'},
            {name: TAPi18n.__("Metrics"), slug: 'metrics'},
            {name: TAPi18n.__("Related"), slug: 'related'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});
Template.showArticle.events({
    'click .pdfDownload': function(){
        console.log(111);
        CountArticle.insert({
            articleId: this._id,
            userId: Meteor.userId(),
            when: new Date(),
            action: "pdfDownload"
        })
    }
})