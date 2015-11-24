var drId;
var delayRender = function () {
    if (drId) return;
    drId = Meteor.setTimeout(function () {
        console.log('dr..')

        if (!Router.current().data || !Router.current().data() || !Router.current().data().figures) {
            return;
        }
        var figs = Router.current().data().figures;
        _.each(figs, function (fig) {
            var refs = $("xref[ref-type='fig'][rid='" + fig.id + "']");
            if (!_.isEmpty(refs) && !_.isEmpty(fig.links)) {
                refs = $("xref[ref-type='fig'][rid='" + fig.links[0] + "']");
            }
            if (refs && refs.length) {
                Blaze.renderWithData(Template.figure, fig, $(refs[0]).closest("p")[0]);
                //$(refs[0]).remove();
            }
        });

        var tbs = Router.current().data().tables;
        _.each(tbs, function (tb) {
            var refs = $("xref[ref-type='table'][rid='" + tb.id + "']");
            if (refs && refs.length) {
                Blaze.renderWithData(Template.atttable, tb, $(refs[0]).closest("p")[0]);
            }
        });
        drId = undefined;
    }, 1000)
}

ReactiveTabs.createInterface({
    template: 'articleTabs',
    onChange: function (slug, template) {
        var article = Router.current().data && Router.current().data();
        if (!article)return;
        if (slug === 'abstract') {
            Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
                ArticleViews.insert({
                    articleId: article._id,
                    userId: Meteor.userId(),
                    journalId: article.journalId,
                    when: new Date(),
                    action: "abstract",
                    ip: session
                });
            });
        } else if (slug === 'full text') {
            Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
                ArticleViews.insert({
                    articleId: article._id,
                    userId: Meteor.userId(),
                    journalId: article.journalId,
                    when: new Date(),
                    action: "fulltext",
                    ip: session
                });
            });
            if (!_.isEmpty(article.keywords)) {
                var keywords = _.compact(_.union(article.keywords.en, article.keywords.cn));
                if (!_.isEmpty(keywords)) {
                    _.each(Keywords.find({name: {$in: keywords}}, {fields: {_id: 1}}).fetch(), function (k) {
                        Keywords.update({_id: k._id}, {$inc: {"score": 2}}, {multi: true});
                    });
                }
            }
            Users.recent.read(article);
        }
    }
});

var removeArticleFromArray = function (array, articleId) {
    var temp = [];
    while (array.length) {
        var oneId = array.shift();
        if (oneId._id != articleId) {
            temp.push(oneId);
        }
    }
    return temp;
};

Template.showArticle.onRendered(function () {
    delayRender();
    TAPi18n.addChangeHook('dynamicRender', delayRender);
    var rva = Session.get("recentViewedArticles");
    if (!rva) {
        rva = [];
    } else if (_.findWhere(rva, {_id: this.data._id})) {
        rva = removeArticleFromArray(rva, this.data._id);
    } else if (rva.length == 3) {
        rva.pop();
    }
    rva.unshift({_id: this.data._id});//add a article to array[0]
    Session.set("recentViewedArticles", rva);

    if (!_.isEmpty(this.data.affiliations) && this.data.affiliations.length == 1) {
        Session.set("hideAffLabel", true);
    }
    //Rating Start
    var aid = this.data._id;

    Tracker.autorun(function () {
        var a = Articles.findOne({_id: aid});
        if (!a)return;
        var arr = a.rating || [];
        $('.raty').raty({
            //half: true,
            score: function () {
                if (arr.length > 0) {
                    var sum = 0;
                    _.each(arr, function (element) {
                        sum += element.score;
                    });
                    return sum / arr.length;
                } else {
                    return 0;
                }
            },
            click: function (score, evt) {
                if (Meteor.userId()) {
                    var temp = _.find(arr, function (obj) {
                        return obj.user == Meteor.userId();
                    });
                    if (temp) {
                        arr = _.without(arr, temp);
                    }
                    arr.push({"user": Meteor.userId(), score: score});
                    Articles.update({_id: aid}, {$set: {rating: arr}});
                }
                return false;
            }
        });
    });
    //Rating End
});

Template.showArticle.helpers({
    getPdfById: function (id) {
        console.log(id);
        return Collections.Pdfs.findOne({_id: id}).url() + "&download=true";
    },
    Language: function (num2) {
        if (num2 == "1") {
            return TAPi18n.__("English");
        }
        if (num2 == "2") {
            return TAPi18n.__("Chinese");
        }
    },
    refs: function () {
        var allrefs = [];
        if (!_.isEmpty(this.affs)) {
            _.each(this.affs, function (aff) {
                var match = /\d/.exec(aff);
                if (!_.isEmpty(match)) {
                    allrefs.push(match[0]);
                }
            })
            if (!_.isEmpty(allrefs)) {
                allrefs = _.sortBy(allrefs, function (i) {
                    return i
                });
            }
        }
        if (this.email && Router.current().data) {
            var note = _.find(Router.current().data().authorNotes, function (note) {
                return note.id == this.email
            });
            allrefs.push((note && note.label) || "*");
        }
        if (!_.isEmpty(allrefs)) {
            return allrefs;
        }
    },
    getLabel: function () {
        return this.label || "*";
    }
});

Template.articleOptions.helpers({
    context: function () {
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        return Articles.findOne({doi: currentDoi});
    },
    tabs: function () {
        return [
            {name: TAPi18n.__("Abstract"), slug: 'abstract'},
            {name: TAPi18n.__("Full Text"), slug: 'full text'},
            {
                name: TAPi18n.__("References") + "(" + (this.references ? this.references.length : 0) + ")",
                slug: 'references'
            },
            {name: TAPi18n.__("Cited By") + "(" + (this.citations ? this.citations.length : 0) + ")", slug: 'cited by'},
            {name: TAPi18n.__("Data & Media"), slug: 'data media'},
            {name: TAPi18n.__("Metrics"), slug: 'metrics'},
            {name: TAPi18n.__("Related"), slug: 'related'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    },
    ipRedirect: function () {
        if (this.language === "2") return false;
        return Session.get("ipInChina");
    }
});

Template.showArticle.events({
    'click .pdfDownload': function () {
        ArticleViews.insert({
            articleId: this._id,
            userId: Meteor.userId(),
            journalId: this.journalId,
            when: new Date(),
            action: "pdfDownload"
        })
    }
});

var getNextPage = function (issue, page, ascending) {
    var articlesInThisIssue = Articles.find({issueId: issue},{fields:{elocationId:1,doi:1}}).fetch();
    var articlesOrderedByPage = _.sortBy(articlesInThisIssue, function (a) {
        return parseInt(a.elocationId, 10);
    });
    var dois = _.pluck(articlesOrderedByPage, "elocationId");
    var positionInList = _.indexOf(dois, page, true);
    var nextPageIndex = ascending ? positionInList + 1 : positionInList - 1;
    if (!articlesOrderedByPage[nextPageIndex]) return false;
    var nextDoi = articlesOrderedByPage[nextPageIndex].doi;
    return nextDoi.substring(nextDoi.lastIndexOf("/") + 1);
}
Template.articlePageNavigation.helpers({
    previousArticle: function () {
        var curIssue = this.issueId;
        return getNextPage(curIssue, this.elocationId, false);
    },
    nextArticle: function () {
        var curIssue = this.issueId;
        return getNextPage(curIssue, this.elocationId, true);
    }
});


Template.figModal.helpers({
    "label": function () {
        if (!Session.get("fig"))
            return "";
        return Session.get("fig").label;
    },
    "caption": function () {
        if (!Session.get("fig"))
            return;
        return Session.get("fig").caption;
    },
    "img": function () {
        if (!Session.get("fig"))
            return;
        var grap = _.find(Session.get("fig").graphics, function (g) {
            return g.use == 'online';
        });
        return grap.href;
    }
});