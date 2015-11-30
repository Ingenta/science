SolrQuery = {
	lastQuery             : null,
	session               : new ReactiveDict(),
	get                   : function (key) {
		return SolrQuery.session.get(key);
	},
	set                   : function (key, val) {
		SolrQuery.session.set(key, val);
		return SolrQuery;
	},
	add                   : function (key, val) {
		var arr = SolrQuery.get(key) || [];
		arr.push(val);
		SolrQuery.set(key, arr);
		return SolrQuery;
	},
	setting               : function (key, val) {
		var setting = SolrQuery.get("setting");
		if (!setting)
			setting = {};
		if (key === undefined)
			return setting;
		if (val === undefined) {
			return setting[key];
		} else {
			setting[key] = val;
			SolrQuery.set("setting", setting);
			return setting;
		}
	},
	params                : function (key, val) {
		var params = SolrQuery.get("params");
		if (!params)
			params = {};
		if (key === undefined)
			return params;
		if (val === undefined) {
			return params[key];
		} else {
			if (_.isEmpty(val)) {
				delete params[key];
			} else {
				params[key] = val;
			}
			SolrQuery.set("params", params);
			return params;
		}
	},
	setQuery              : function (val) {
		SolrQuery.params("q", val);
	},
	toggleFilterQuery     : function (field, val, isAdd) {
		var params     = SolrQuery.params();
		var currFilter = params.fq && params.fq[field] || [];
		if (isAdd) {
			currFilter = _.union(currFilter, [val]);
		} else {
			currFilter = _.without(currFilter, val);
		}
		if (!params.fq) {
			params.fq = {};
		}
		params.fq[field] = currFilter;
		SolrQuery.params("fq", params.fq);
	},
	changeFilterQuery     : function (field, val) {
		var params       = SolrQuery.params();
		params.fq[field] = [val];
		SolrQuery.params("fq", params.fq);
	},
	addSecondQuery        : function (val) {
		var sq = SolrQuery.params("sq") || [];
		sq     = _.union(sq, [val]);
		SolrQuery.params("sq", sq);
	},
	makeUrl               : function (option) {
		var queryStr = JSON.stringify(option ? option.query : SolrQuery.params("q"));
		var fqStr    = JSON.stringify(QueryUtils.getFilterQuery(option ? option.filterQuery : SolrQuery.params("fq")));
		var sqStr    = JSON.stringify(option ? option.secondQuery : SolrQuery.params("sq"));
		var setting  = (option ? option.setting : SolrQuery.params("st")) || {};
		if (!setting.start)
			setting.start = 0;
		if (!setting.rows)
			setting.rows = 10;
		var settingStr = JSON.stringify(setting);
		var qString    = "";
		if (queryStr) {
			qString += "&q=" + queryStr;
		}
		if (fqStr) {
			qString += "&fq=" + fqStr;
		}
		if (sqStr) {
			qString += "&sq=" + sqStr;
		}
		if (settingStr) {
			qString += "&st=" + settingStr;
		}
		qString += "&stamp=" + new Date().getTime();
		if (qString) {
			qString = "?" + qString.substr(1)
		}

		return "/search" + qString;
	},
	/**
	 * 搜索方法，主要通过调用这个方法来进行搜索
	 * @param option
	 */
	search                : function (option) {
		var url = SolrQuery.makeUrl(option);
		Router.go(url);
	},
	/**
	 * 兴趣检索
	 * @param event
	 */
	interstingSearch      : function (event) {
		event.stopPropagation();
		event.preventDefault();
		var content = Science.dom.getSelContent();
		if (content) {
			var trimContent = content.trim();
			if (trimContent.length > 2 && trimContent.length < 100) {
				var journalId = Session.get('currentJournalId');
				var articleId = Router.current().data() && Router.current().data()._id;
				var fq        = {};
				if (journalId)
					fq.journalId = journalId;
				if (articleId)
					fq.not_id = articleId;
				var query = {
					q : trimContent,
					fq: fq,
					st: {rows: 5}
				};
				Meteor.call("search", query, function (err, result) {
					var ok = err ? false : result.responseHeader.status == 0;
					if (ok) {
						QueryUtils.interstingSearchPop(event, trimContent, journalId, result);
					}
				})
			}
		}
	},
	/**
	 * 清空所有搜索选项
	 */
	reset                 : function () {
		_.each(SolrQuery.session.keys, function (val, key) {
			SolrQuery.session.set(key, null);
		});
	},
	/**
	 * 清空二次检索条件
	 */
	resetSecQuery         : function () {
		SolrQuery.params("sq", []);
	},
	/**
	 * 若两次检索时间间隔小于0.5秒,拒绝请求
	 * @returns {null|boolean}
	 */
	searchLimit           : function () {
		var result          = (SolrQuery.lastQuery && (new Date() - SolrQuery.lastQuery) < 500)
		SolrQuery.lastQuery = new Date();
		return result;
	},
	callSearchMethod      : function () {
		if (SolrQuery.searchLimit()) {
			return;
		}
		SolrQuery.reset();
		var params = QueryUtils.parseUrl();
		if (!_.isEmpty(params.q) && _.isString(params.q)) {
			Users.recent.search(params.q);
			var setting = params.st || {};
			var q       = (_.contains(["bar", "history"], setting.from)) ? params.q : "";
			$("#searchInput").val(q);
			if (Meteor.userId()) {
				var his = !_.isEmpty(Meteor.user().history) && Meteor.user().history || {unsave: []}
				var obj = _.find(his, function (arr, key) {
					return _.find(arr, function (item) {
						return item.word === q;
					})
				});
				if (!obj) {
					his.unsave = his.unsave || [];
					his.unsave.push({word: q, from: setting.from, createOn: new Date()})
					Users.update({_id: Meteor.userId()}, {$set: {"history": his}});
				}
			}
		}
		Meteor.call("search", params, function (err, result) {
			SolrQuery.session.set("params", params);
			var ok = err ? false : result.responseHeader.status == 0;
			SolrQuery.session.set("ok", ok);
			if (ok) {
				if (result.response) {
					SolrQuery.session.set("numFound", result.response.numFound);
					SolrQuery.session.set("start", result.response.start);
					SolrQuery.session.set("docs", result.response.docs);
				}
				if (result.facet_counts) {
					SolrQuery.session.set("facets", result.facet_counts.facet_fields);
				}
				if (result.highlighting) {
					SolrQuery.session.set("highlight", result.highlighting);
				}
			}
		});
	},
	select2Options:function(filter) {
		SolrQuery.set("s2optFilter",filter);
		return {
			placeholder       : TAPi18n.__("Choose"),
			ajax              : {
				url           : "/ajax/search",
				dataType      : 'json',
				delay         : 250,
				data          : function (params) {
					var queryObj  = {};
					queryObj.q    = JSON.stringify(params.term);
					queryObj.page = params.page;
					if(!_.isEmpty(SolrQuery.get("s2optFilter"))){
						queryObj.fq = JSON.stringify(SolrQuery.get("s2optFilter"));
					}
					return queryObj;
				},
				processResults: function (data, params) {
					params.page = params.page || 1;
					return {
						results   : data.response.docs,
						pagination: {
							more: (params.page * 10) < data.response.numFound
						}
					};
				},
				cache         : true
			},
			escapeMarkup      : function (markup) {
				return markup;
			}, // let our custom formatter work
			minimumInputLength: 1,
			templateResult    : QueryUtils.formatRepo, // omitted for brevity, see the source of this page
			templateSelection : QueryUtils.formatRepoSelection // omitted for brevity, see the source of this page
		}
	}
};