var delayRender = function () {
    Meteor.setTimeout(function () {
        console.log('dr..');

        if (!Router.current().data || !Router.current().data() || !Router.current().data().figures) {
            return;
        }
        var figs = Router.current().data().figures;
        _.each(figs, function (fig) {
            var refs = $("xref[original='true'][ref-type='fig'][rid='" + fig.id + "']");
            if (_.isEmpty(refs)) {
                refs = $("xref[ref-type='fig'][rid='" + fig.id + "']");
            }
            if (!_.isEmpty(refs) && !_.isEmpty(fig.links)) {
                refs = $("xref[ref-type='fig'][rid='" + fig.links[0] + "']");
            }
            if (refs && refs.length) {
                var closestP = $(refs[0]).closest("p");
                if (closestP.length) {
                    Blaze.renderWithData(Template.figure, fig, closestP[0]);
                    closestP.show();
                    //$(refs[0]).remove();
                }
            }
        });

        var tbs = Router.current().data().tables;
        _.each(tbs, function (tb) {
            var refs = $("xref[ref-type='table'][rid='" + tb.id + "']");
            if (refs && refs.length) {
                Blaze.renderWithData(Template.atttable, tb, $(refs[0]).closest("p")[0]);
            }
        });
    }, 1000)
}

ReactiveTabs.createInterface({
    template: 'articleTabs',
    onChange: function (slug, template) {
        var article = Router.current().data && Router.current().data();
        if (!article && !article.doi)return;
        if (slug === 'abstract') {
            Meteor.call("insertAudit", Meteor.userId(), "abstract", article.publisher, article.journalId, article._id, function (err, response) {
                if (err) console.log(err);
            });
        } else if (slug === 'full text') {
            Meteor.call("insertAudit", Meteor.userId(), "fulltext", article.publisher, article.journalId, article._id, function (err, response) {
                if (err) console.log(err);
            });
            if (!_.isEmpty(article.keywords)) {
                var keywords = _.compact(_.union(article.keywords.en, article.keywords.cn));
                if (!_.isEmpty(keywords)) {
                    Meteor.call('updateKeywordScore', keywords, 2, function (err, result) {
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
    console.log('showArticle rendered..');
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
    refs: function () {
        var affObjs = Router.current().data().affiliations;
        var allrefs = [];
        if (!_.isEmpty(this.affs)) {
            _.each(this.affs, function (aff) {
                var match = /\d/.exec(aff);
                var labelInId = !_.isEmpty(match) && match[0];
                var currAffObj = _.find(affObjs, function (ao) {
                    return ao.id == aff;
                })
                var labelInData = currAffObj && !_.isEmpty(currAffObj.label) && currAffObj.label[TAPi18n.getLanguage() == "zh-CN" ? "cn" : "en"]
                allrefs.push(labelInData || labelInId)
            })
            if (!_.isEmpty(allrefs)) {
                allrefs = allrefs.sort();
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
        var tabArr = [
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
        if(this.hasMoop){
            tabArr.push({name: TAPi18n.__("MOOP"),slug:'moop'})
        }
        return tabArr;
    },
    activeTab: function () {
        return Session.get('activeTab');
    },
    ipRedirect: function () {
        //NOTE: no articles redirect as this functionality was only temporary until february 28th 2016
        return true;
        //if (Permissions.isAdmin())return true;
        //if (this.language === "2") return true;
        //return Session.get("ipInChina");
    }
});

Template.showArticle.events({
    'click .pdfDownload': function () {
        var article = Router.current().data && Router.current().data();
        if (!article)return;
        Meteor.call("insertAudit", Meteor.userId(), "pdfDownload", article.publisher, article.journalId, article._id, function (err, response) {
            if (err) console.log(err);
        });
    }
});

var getNextPage = function (issue, page, ascending) {
    var articlesInThisIssue = Articles.find({issueId: issue}, {fields: {elocationId: 1, doi: 1}}).fetch();
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
        if (!this.elocationId)return false;
        var curIssue = this.issueId;
        return getNextPage(curIssue, this.elocationId, false);
    },
    nextArticle: function () {
        if (!this.elocationId)return false;
        var curIssue = this.issueId;
        return getNextPage(curIssue, this.elocationId, true);
    },
    hasIssue: function () {
        if (this.pubStatus && this.pubStatus === "normal")return true;
        return false;
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