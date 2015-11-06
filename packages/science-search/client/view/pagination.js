Template.btPagination.helpers({
	disabledStatus:function(name){
		var currPage = Template.instance().data.currPage;
		if(name === "first" || name ==="prev"){
			return currPage==1?"disabled":"";
		}else if(name ==="next" || name ==="last"){
			var total = Template.instance().data.total;
			var row = Template.instance().data.rows || 10;
			var totalPage = Math.ceil(total / row);
			return currPage==totalPage?"disabled":"";
		}
	},
	pageRange:function(){
		var currPage = Template.instance().data.currPage;
		var maxShow = Template.instance().data.maxShow || 10;
		var total = Template.instance().data.total;
		var row = Template.instance().data.rows || 10;
		var totalPage = Math.ceil(total / row);

		var range = {min:currPage,max:currPage};
		range.max = range.max + Math.floor(maxShow/2);
		if(range.max>totalPage){
			range.max=totalPage;
		}
		range.min = range.max-maxShow+1;
		if(range.min < 1){
			range.min=1;
		}
		var pr = [];
		for(var i=range.min;i<=range.max;i++){
			pr.push(i);
		}
		return pr;
	},
	activeStatus:function(){
		return Template.instance().data.currPage == this ? "active": "";
	},
	page:function(name){
		var currPage = Template.instance().data.currPage;
		var total = Template.instance().data.total;
		var row = Template.instance().data.rows || 10;
		var totalPage = Math.ceil(total / row);
		if(name==='first'){
			return 1;
		}else if(name ==='prev') {
			return currPage > 1? currPage-1:1;
		}else if(name==='next'){
			return currPage < totalPage ? currPage+1: totalPage;
		}else if(name ==='last'){
			return totalPage;
		}
	},
	moreThanOne:function(){
		var total = Template.instance().data.total;
		var row = Template.instance().data.rows || 10;
		return total > row;
	}
});

Template.btPagination.events({
	'click ul.pagination>li>a' : function(e){
		e.preventDefault();
		var func = Template.instance().data.onClick;
		if(func && typeof(func)=='function'){
			var page = $(e.currentTarget).data("pagenum");
			var row = Template.instance().data.rows || 10;
			func(page,row);
		}
	},
	'click a.perPage': function(e){
		e.preventDefault();
		var rows = $(e.currentTarget).data("pagenum");
		var setting = SolrQuery.params('st');
		setting.rows=rows;
		SolrQuery.params('st',setting);
		Router.go(SolrQuery.makeUrl());
	}
});