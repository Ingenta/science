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
        return this.title==='__start__'?TAPi18n.__("IntroductionInFulltext"):this.title;
    },
    anyReference:function(){
        return !_.isEmpty(Template.currentData().references);
    }
})

Template.FullTextTemplate.events({
    "click xref": function (e) {
        e.stopPropagation();
        e.preventDefault();
        var xr = $(e.target);
        var rid = xr.attr("rid");
        if (rid) {
            //----插图
            var fig = _.find(Template.currentData().figures, function (fig) {
                return fig.id == rid || _.contains(fig.links, rid);
            });
            if (fig) {
                Session.set("fig", fig);
                $(".figure-modal").modal('show');
                return;
            }
            //----表格
            var table = _.find(Template.currentData().tables, function (table) {
                return table.id == rid;
            });
            if (table) {
                Session.set("table", table);
                $(".table-modal").modal('show');
                return;
            }
            //----引用文献
            if(rid.startWith('REF')){
                var indexStr = xr[0].innerText.replace("[","").replace("]","").trim();
                if(/^\d{1,3}(\s*?[~-－––,，]\s*?\d{1,3})*$/.test(indexStr)){
                    var refIndexs = Science.String.parseToNumbers(indexStr);
                    if(!_.isEmpty(refIndexs)){
                        Session.set("refs",refIndexs);
                    }
                }else{
                    var reference = _.find(Template.currentData().tables, function (table) {
                        return table.id == rid;
                    });
                    if(reference && reference.index)
                        Session.set("refs",[reference.index]);
                }
                $(".reference-modal").modal('show');
                return;
            }
            Science.dom.scollToElement("#"+rid);
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
        var fig = FiguresStore.findOne({_id: id});
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
        var a = FiguresStore.findOne({_id: fig.imageId});
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
Template.tableModal.onRendered(function(){
    Template.instance().$('table').addClass('table table-striped')
})

Template.referenceModal.helpers({
    "referencesArr": function(){
        var allRefs = Template.currentData().references;
        var currRefs = Session.get("refs");
        if(_.isEmpty(allRefs) || _.isEmpty(currRefs))
            return;
        var refs = _.filter(allRefs,function(ref){
            return _.find(currRefs,function(cr){
                return cr==ref.index;
            });
        });
        return refs;
    }
})

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