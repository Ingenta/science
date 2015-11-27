function formatRepo (repo) {
	if (repo.loading) return repo.text;
	var markup = Blaze.toHTMLWithData(Template.solrArticleMarkup,repo);
	return markup;
}

function formatRepoSelection (repo) {
	return repo["title.cn"];
}

Template.solrArticleSelector.onRendered(function(){
	this.$(".solr-article-select").select2({
		ajax: {
			url: "/ajax/search",
			dataType: 'json',
			delay: 250,
			data: function (params) {
				var queryObj = {};
				queryObj.q= JSON.stringify(params.term);
				queryObj.page = params.page;
				return queryObj;
			},
			processResults: function (data, params) {
				// parse the results into the format expected by Select2
				// since we are using custom formatting functions we do not need to
				// alter the remote JSON data, except to indicate that infinite
				// scrolling can be used
				params.page = params.page || 1;

				return {
					results: data.response.docs,
					pagination: {
						more: (params.page * 10) < data.response.numFound
					}
				};
			},
			cache: true
		},
		escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		minimumInputLength: 1,
		templateResult: formatRepo, // omitted for brevity, see the source of this page
		templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
	});
})


Template.solrArticleMarkup.helpers({
	id:function(){
		return this.id;
	},
	showTitle:function(){
		var isLangCn = TAPi18n.getLanguage()==="zh-CN";
		return isLangCn?this["title.cn"]:this["title.en"];
	}
})