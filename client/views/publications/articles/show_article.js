var delayRender = function () {
    Meteor.setTimeout(function () {
        console.log('dr..');

        if (!Router.current().data) {
            return;
        }
        var articleObj = Router.current().data();
        if(!articleObj)
            return;

        //--------------渲染正文中的图表开始--------------
        _.each(articleObj.figures, function (fig) {
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

        _.each(articleObj.tables, function (tb) {
            var refs = $("xref[ref-type='table'][rid='" + tb.id + "']");
            if (refs && refs.length) {
                Blaze.renderWithData(Template.atttable, tb, $(refs[0]).closest("p")[0]);
            }
        });
        //--------------渲染正文中的图表结束--------------


        //--------------渲染附录中的图表开始--------------
        if(!articleObj.appendix)
            return;
        _.each(articleObj.appendix.figures, function (fig) {
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
        _.each(articleObj.appendix.tables, function (tb) {
            var refs = $("xref[ref-type='table'][rid='" + tb.id + "']");
            if (refs && refs.length) {
                Blaze.renderWithData(Template.atttable, tb, $(refs[0]).closest("p")[0]);
            }
        });
        //--------------渲染正文中的图表结束--------------
    }, 1000)
}
var lastInsertAuditTime = new Date();
ReactiveTabs.createInterface({
    template: 'articleTabs',
    onChange: function (slug, template) {
        history.replaceState({},document.title,window.location.pathname + "?slug="+slug);
        var article = Router.current().data && Router.current().data();
        if (!article || !article.doi)return;
        var result = (new Date() - lastInsertAuditTime) > 500;
        lastInsertAuditTime = new Date();
        if (slug === 'abstract') {
            if(result){
                Meteor.call("insertAudit", Meteor.userId(), "abstract", article.publisher, article.journalId, article._id, function (err, response) {
                    if (err) console.log(err);
                });
            }
        } else if (slug === 'full text') {
            if(result){
                Meteor.call("insertAudit", Meteor.userId(), "fulltext", article.publisher, article.journalId, article._id, function (err, response) {
                    if (err) console.log(err);
                });
            }
            if (!_.isEmpty(article.keywords)) {
                var keywords = _.compact(_.union(article.keywords.en, article.keywords.cn));
                if (!_.isEmpty(keywords)) {
                    Meteor.call('updateKeywordScore', keywords, 2, function (err, result) {
                    });
                }
            }
            Users.recent.read(article);
        }
        else if (slug === 'metrics') {
            prepareMetricsForThisArticle();
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
                }else{
                    sweetAlert({
                        title             : TAPi18n.__("signInOrRegister"),
                        text              : TAPi18n.__("signInFirst"),
                        type              : "info",
                        showCancelButton  : false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText : TAPi18n.__("OK"),
                        closeOnConfirm    : true
                    });
                }
                return false;
            }
        });
    });
    //Rating End
});

Template.showArticle.helpers({
    refs: function () {
        if(!Router.current().data) return;
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
    },
    ipDownloadLimitation: function () {
        //NOTE: no articles redirect as this functionality was only temporary until february 28th 2016
        //return true;
        if (Permissions.isAdmin())return true;
        if (this.language === "2") return true;
        return Session.get("ipInChina");
    }
});

Template.articleOptions.helpers({
    context: function () {
        if(Router.current().params.articleDoi){
            var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi.replace(/-slash-/g,"/");
        }
        return Articles.findOne({doi: currentDoi});
    },
    tabs: function () {
        var tabArr = [
            {name: TAPi18n.__("Abstract"), slug: 'abstract'},
            {name: TAPi18n.__("Full Text"), slug: 'full text', isDisabled: _.isEmpty(this.sections)},
            {
                name: TAPi18n.__("References") + "(" + (this.references ? this.references.length : 0) + ")",
                slug: 'references',isDisabled:_.isEmpty(this.references)
            },
            {name: TAPi18n.__("Cited By") + "(" + (this.citations ? this.citations.length : 0) + ")", slug: 'cited by',isDisabled:_.isEmpty(this.citations)},
            {name: TAPi18n.__("Data & Media"), slug: 'data media'},
            {name: TAPi18n.__("Metrics"), slug: 'metrics'},
            {name: TAPi18n.__("Related"), slug: 'related'}
        ];
        if (this.hasMoop) {
            tabArr.push({name: TAPi18n.__("MOOP"), slug: 'moop'})
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
Template.articlePageNavigation.onCreated(function () {
    this.nextDoi = new ReactiveVar(0);
    this.prevDoi = new ReactiveVar(0);
    if (this.data.elocationId && this.data.issueId) {
        var pDoi = this.prevDoi;
        Meteor.call("previousDoi", this.data.padPage, this.data.issueId, function (err, response) {
            if (err) console.log(err);
            pDoi.set(response);
        })
        var nDoi = this.nextDoi;
        Meteor.call("nextDoi", this.data.padPage, this.data.issueId, function (err, response) {
            if (err) console.log(err);
            nDoi.set(response);
        })
    }
})

Template.articlePageNavigation.helpers({
    previousArticle: function () {
        var rootUrl = window.location.pathname;
        var url = rootUrl.substring(0,rootUrl.lastIndexOf("/") + 1);
        if(Template.instance().prevDoi.get())return url + Template.instance().prevDoi.get();
        return Template.instance().prevDoi.get();
    },
    nextArticle: function () {
        var rootUrl = window.location.pathname;
        var url = rootUrl.substring(0,rootUrl.lastIndexOf("/") + 1);
        if(Template.instance().nextDoi.get())return url + Template.instance().nextDoi.get();
        return Template.instance().nextDoi.get();
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
        if(Session.get("fig").labelCn)
            return TAPi18n.getLanguage() == "zh-CN" ? Session.get("fig").labelCn : Session.get("fig").label;
        return Session.get("fig").label;
    },
    "caption": function () {
        if (!Session.get("fig"))
            return;
        if(Session.get("fig").captionCn)
            return TAPi18n.getLanguage() == "zh-CN" ? Session.get("fig").captionCn : Session.get("fig").caption;
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