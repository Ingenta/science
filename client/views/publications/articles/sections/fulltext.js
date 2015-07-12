Template.FullTextTemplate.onRendered(function () {
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

			$(".bs-example-modal-md").modal('show');
		}

	}
});

Template.figModal.helpers({
	"title":function(){
		if(!Session.get("fig"))
			return "";
		return "fig."+Session.get("fig").id;
	},
	"caption":function(){
		if(!Session.get("fig"))
			return;
		return Session.get("fig").caption;
	},
	"img":function(){
		if(!Session.get("fig"))
			return;
		var grap = _.find(Session.get("fig").graphics,function(g){
			return g.use == 'online';
		});
		return grap.href;
	}
});