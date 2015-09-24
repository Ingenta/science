var initFulltext = function () {
    $('body').scrollspy({
        target: '#section-index'
    });
    $("#sidebar").affix({
        offset: {
            top: function () {
                $("#sidebar").css({"width": $("#section-index").width()});
                return $("#section-index").offset().top - 20;
            }
        }
    });

    var figs = Router.current().data().figures;
    _.each(figs, function (fig) {
        var refs = $("xref[ref-type='fig'][rid='" + fig.id + "']");
        if (!refs || !refs.length) {
            refs = $("xref[ref-type='fig'][rid='" + fig.links[0] + "']");
        }
        if (refs && refs.length) {
            Blaze.renderWithData(Template.figure, fig, $(refs[0]).closest("p")[0]);
        }
    });

    var tbs = Router.current().data().tables;
    _.each(tbs, function (tb) {
        var refs = $("xref[ref-type='table'][rid='" + tb.id + "']");
        if (refs && refs.length) {
            Blaze.renderWithData(Template.atttable, tb, $(refs[0]).closest("p")[0]);
        }
    });
};

Template.FullTextTemplate.onRendered(function () {
    initFulltext();

});

Meteor.startup(function () {
    TAPi18n.addChangeHook("fullTextInit", function () {
        if (Router.current().route.getName() == 'article.show') {
            Meteor.setTimeout(initFulltext, 1000);
        }
    });
});

Template.FullTextTemplate.events({
    "click xref[ref-type='fig']": function (e) {
        var rid = ($(e.target).attr("rid"));
        if (rid) {
            var fig = _.find(Template.currentData().figures, function (fig) {
                return fig.id == rid || _.contains(fig.links, rid);
            });
            if (fig) {
                Session.set("fig", fig);
            }
            $(".figure-modal").modal('show');
        }
    },
    "click xref[ref-type='table']": function (e) {
        var rid = ($(e.target).attr("rid"));
        if (rid) {
            var table = _.find(Template.currentData().tables, function (table) {
                return table.id == rid;
            });
            if (table) {
                Session.set("table", table);
            }
            $(".table-modal").modal('show');
        }
    },
    "click #resetFulltext": function () {
        initFulltext();
    },
    'mouseup #fulltext-viewer':function(e){
        SolrQuery.interstingSearch(e);
    }
});

Template.figure.helpers({
    getFigById: function (id) {
        if (!id)return;
        var fig = ArticleXml.findOne({_id: id});
        if (!fig)return;
        return fig.url();
    }
});

Template.figure.events({
    "click .figure-image": function () {
        Session.set("fig", this);
        $(".figure-modal").modal('show');
    }
})
Template.figModal.helpers({
    getFigFromSession: function () {
        var fig = Session.get("fig");
        if (!fig || !fig.imageId)return;
        var a = ArticleXml.findOne({_id: fig.imageId});
        if (!a)return;
        return a.url();
    }
});
Template.tableModal.helpers({
    "label": function () {
        if (!Session.get("table"))
            return "";
        return Session.get("table").label;
    },
    "caption": function () {
        if (!Session.get("table"))
            return;
        return Session.get("table").caption;
    },
    "table": function () {
        if (!Session.get("table"))
            return;
        return Session.get("table").table;
    }
});