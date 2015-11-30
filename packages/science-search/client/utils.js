QueryUtils = {
	getFilterQuery: function (queryObj) {
		var fqObj;
		if (queryObj) {
			_.each(queryObj, function (val,key) {
				if(!_.isEmpty(val)){
					fqObj = fqObj || {};
					fqObj[key]=val;
				}
			})
		}
		return fqObj;
	},
	getSolrFormat       : function (date) {
		if (!date)
			return "*";
		if (typeof date === 'string') {
			if(date.trim())
				return new Date(date).toSolrString();
			return "*";
		} else {
			return date.toSolrString();
		}
	},
	interstingSearchPop : function (event, keyword, journalId, result) {
		var htmlContent = Blaze.toHTMLWithData(Template.selectionSearch, {
			keyword  : keyword,
			journalId: journalId,
			result   : result
		});

		var templateContent = Blaze.toHTML(Template.qsPopTemplate);

		var pointEle = $(".point-ele");
		if (!pointEle || !pointEle.length) {
			pointEle = $('<a href="#" class="point-ele" role="button" tabindex="0" data-toggle="popover" ></a>');
			$("body").append(pointEle);
		}
		pointEle.on('hidden.bs.popover', function () {
			pointEle.popover('destroy');
			pointEle.remove();
		});


		pointEle.css({left: event.pageX, top: event.pageY});
		pointEle.popover({
			html    : true,
			content : htmlContent,
			title   : TAPi18n.__("interstingSearch"),
			trigger : "focus",
			template: templateContent
		});
		pointEle.focus();
	},
	//从Url中获取参数
	parseUrl : function () {
		var params = {};
		_.each(Router.current().params.query, function (obj, key) {
			params[key] = JSON.parse(obj);
		});
		if(params.st && params.st.from === 'topic'){
			if(_.isEmpty(params.fq) || _.isEmpty(params.fq.topic))
				delete params.st.from;
		}
		return params;
	},
	formatRepo            : function (repo) {
		if (repo.loading) return repo.text;
		var markup = Blaze.toHTMLWithData(Template.solrArticleMarkup, repo);
		return markup;
	},
	formatRepoSelection: function (repo) {
		return repo["title.cn"];
	}
}