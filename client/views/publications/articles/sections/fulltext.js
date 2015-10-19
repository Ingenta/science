var initFulltext = function () {
    $('body').scrollspy({
        target: '#section-index'
    });
    $("#indexsidebar").affix({
        offset: {
            top: function () {
                var secIndex=$("#section-index");
                //secIndex.css({"width": secIndex.width()});
                return secIndex.offset().top - 20;
            }
        }
    });
};

Template.FullTextTemplate.onRendered(function () {
    initFulltext();
});

Template.FullTextTemplate.helpers({
    handledTitle:function(){
        return this.title==='__start__'?"":this.title;
    }
})

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

Template.sectionSelector.helpers({
    handledSections:function(){
        if(!_.isEmpty(this.sections) && this.sections[0].title==='__start__')
            return _.rest(this.sections);
        return this.sections;
    },
    displayStatus:function(){
        var status = !_.isEmpty(this.sections)
            && ((this.sections[0].title==='__start__' && this.sections.length>1)
                || this.sections[0].title!=='__start__');
        return status?"block":"none";
    }
})