var initFulltext=function(){
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
	_.each(figs,function(fig){
		var refs = $("xref[ref-type='fig'][rid='"+fig.id+"']");
		if(!refs || !refs.length){
			refs = $("xref[ref-type='fig'][rid='"+fig.links[0]+"']");
		}
		if(refs && refs.length){
			Blaze.renderWithData(Template.figure,fig,$(refs[0]).closest("p")[0]);
		}
	});

	var tbs = Router.current().data().tables;
	_.each(tbs,function(tb){
		var refs = $("xref[ref-type='table'][rid='"+tb.id+"']");
		if(refs && refs.length){
			Blaze.renderWithData(Template.atttable,tb,$(refs[0]).closest("p")[0]);
		}
	});
};

Template.FullTextTemplate.onRendered(function () {
	initFulltext();
});

Meteor.startup(function(){
	TAPi18n.addChangeHook("fullTextInit",function(){
		if(Router.current().route.getName()=='article.show'){
			Meteor.setTimeout(initFulltext,1000);
		}
	});
});

Template.FullTextTemplate.events({
	"click xref[ref-type='fig']":function(e){
		var rid=($(e.target).attr("rid"));
		if(rid){
			var fig = _.find(Template.currentData().figures,function(fig){
				return fig.id==rid || _.contains(fig.links,rid);
			});
			if(fig){
				Session.set("fig",fig);
			}
			$(".figure-modal").modal('show');
		}
	},
	"click xref[ref-type='table']":function(e){
		var rid=($(e.target).attr("rid"));
		if(rid){
			var table = _.find(Template.currentData().tables,function(table){
				return table.id==rid;
			});
			if(table){
				Session.set("table",table);
			}
			$(".table-modal").modal('show');
		}
	},
	"click #resetFulltext":function(){
		initFulltext();
	}
});

Template.figure.helpers({
	getFigById: function (id) {
		return ArticleXml.findOne({_id: id}).url();
	}
});

Template.figure.events({
	"click .figure-image":function(){
		Session.set("fig",this);
		$(".figure-modal").modal('show');
	}
})

Template.tableModal.helpers({
	"label":function(){
		if(!Session.get("table"))
			return "";
		return Session.get("table").label;
	},
	"caption":function(){
		if(!Session.get("table"))
			return;
		return Session.get("table").caption;
	},
	"table":function(){
		if(!Session.get("table"))
			return;
		return Session.get("table").table;
	}
});

Template.FullTextTemplate.helpers({
    getKeywords:function(){
        var result=[];
        var total=0;
        _.each(this.keywords,function(item){
            var keyword={};
            keyword.word=item;
            keyword.score=Keywords.findOne({name:item}).score;
            total+=keyword.score;
            result.push(keyword);
        });
        _.each(result,function(item){
            item.percent = item.score / total * 100;
        });
        return  _.sortBy(result,function(obj){
            return -obj.score;
        });
    },
    getScoreByKeyword: function (k) {
        return Keywords.findOne({name: k}).score;
    },
    totals: function (a) {
        var s = 0;
        a.forEach(function(k){
            s += Keywords.findOne({name: k}).score;
        })
        return s;
    }
});