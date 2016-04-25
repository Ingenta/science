var localDevServer = process.env.DOCKER_URL ? process.env.DOCKER_URL : "http://192.168.1.10";
var productionSolrServer = process.env.SOLR_URL ? process.env.SOLR_URL : "http://solr";
var isDev = process.env.ROOT_URL.indexOf('localhost') != -1;
var host = isDev ? localDevServer : productionSolrServer;
SolrClient = Solr.createClient({
    host: host,
    port: "8983",
    core: "/articles",
    path: "/solr"
});


Future = Npm.require('fibers/future');

Config.clearSpecialCharacterRegEx = /[&\/\\#,+()$~%.'"-:*?!<>^{}\[\]]/g;
SolrUtils = {
    fieldMap: {
        "title": ["title.cn", "title.en"],
        "doi": ["doi"],
        "issn": ["issn", "EISSN"],
        "cn": ["CN"],
        "code": ["doi", "issn", "EISSN", "CN"],
        "journalTitle": ["journal.title", "journal.titleCn"],
        "keyword": ["all_keywords"],
        "author": ["all_authors_en", "all_authors_cn"],
        "affiliation": ["all_affiliations_en", "all_affiliations_cn"],
        "abstract": ["abstract"],
        "fulltext": ["fulltext"],
    },
    facetFieldMap: {
        "publisher": ["publisher"],
        "journalId": ["journalId"],
        "author": ["facet_all_authors_en", "facet_all_authors_cn"],
        "authorCn": ["facet_all_authors_cn"],
        "authorEn": ["facet_all_authors_en"],
        "topic": ["all_topics"],
        "year": ["year"],
        "month": ["month"],
        "volume": ["volume"],
        "issue": ["issue"],
        "page": ["startPage", 'elocationId'],
        "publishDate": ["published"],
        "not_id": ["NOT _id"],
        "contentType":["contentType"],
        "pacsCodes":["pacsCodes"]
    },
    getQueryStr: function (queryArr) {
        var qstring;
        if (queryArr) {
            if (typeof queryArr === 'string')
                return queryArr.replace(Config.clearSpecialCharacterRegEx," ").trim().toLowerCase();
            qstring = "";
            var isFirstOne = true;
            _.each(queryArr, function (sQuery) {
                if (!isFirstOne && sQuery.logicRelation) {
                    qstring += " " + sQuery.logicRelation + " ";
                }
                isFirstOne = false;
                var solrFields = SolrUtils.fieldMap[sQuery.key];
                var subQueues = _.map(solrFields, function (sField) {
                    return sField + ":(" + sQuery.val.replace(clearReg," ").trim().toLowerCase() + ")";
                });
                qstring += "(" + subQueues.join(" OR ") + ")";
            })
        }
        return qstring || "";
    },
    getRelatedJournals:function(journals){
        var result=[];
        if(_.isString(journals))
            journals=[journals];
        _.each(journals, function (jId) {
            var journal = Publications.findOne({_id: jId}, {fields: {historicalJournals: 1}})
            if (journal && !_.isEmpty(journal.historicalJournals)) {
                result = _.union(result,jId, journal.historicalJournals);
            }else{
                result = _.union(result,jId);
            }
        })
        return result;
    },
    getFilterQueryStrArr: function (queryObj) {
        var fqStrArr = [];
        if (queryObj) {
            qstring = "";
            _.each(queryObj, function (val, key) {
                isFirstOne = false;
                var solrFields = SolrUtils.facetFieldMap[key];
                if(key == 'journalId') {
                    var journalIdForSolr = SolrUtils.getRelatedJournals(val);
                    val = journalIdForSolr.join(" OR ");
                }
                if (key == 'publishDate') {
                    if (val && (val.start || val.end)) {
                        var subQueues = _.map(solrFields, function (sField) {
                            var start = SolrUtils.getSolrFormat(val.start);
                            var end = SolrUtils.getSolrFormat(val.end);
                            return sField + ":[\"" + start + "\" TO \"" + end + "\"]";
                        });
                        fqStrArr.push(subQueues.join(" OR "));
                    }

                } else {
                    var subQueues = _.map(solrFields, function (field) {
                        if (typeof val === 'string' || typeof val === 'number') {
                            return field + ":" + val;
                        } else if (toString.apply(val) === '[object Array]') {
                            var result = "";
                            _.each(val, function (str) {
                                result += " AND " + field + ":" + str;
                            });
                            if (result.length) {
                                result = result.substr(5);
                                result = "(" + result + ")";
                            }
                            return result;
                        } else if (toString.apply(val) === '[object Object]') {
                            var result = "";
                            var operator = val.operator || "AND";
                            _.each(val.arr, function (str) {
                                result += " " + operator + " " + field + ":" + str;
                            });
                            if (result.length) {
                                result = result.substr(4).trim();
                                result = "(" + result + ")";
                            }
                            return result;
                        }
                    });
                    fqStrArr.push(subQueues.join(" OR "));
                }
            })
        }
        return fqStrArr;
    },

    getSettingStr: function (setting) {
        if (!setting)
            return "";
        var fields = Science.JSON.MergeObject(SolrUtils.fieldMap, SolrUtils.facetFieldMap);
        var settingStr = "";
        _.each(setting, function (val, key) {
            if (val) {
                if (_.contains(["sort", "fl"], key)) {
                    var splitVal = val.trim().split(' ');
                    var field = fields[splitVal[0]] && fields[splitVal[0]][0];
                    settingStr += "&" + key + "=" + field + (splitVal.length > 1 && (" " + splitVal[1]));
                } else {
                    settingStr += "&" + key + "=" + val;
                }
            }
        });
        return settingStr && settingStr.substr(1);//trim frist &
    },
    getSolrFormat: function (date) {
        if (!date)
            return "*";
        if (typeof date === 'string') {
            if (date.trim())
                return new Date(date).toSolrString();
            return "*";
        } else {
            return date.toSolrString();
        }
    },
    search:function (params) {
        SolrClient.triggerBeforeSearch(params);
        var myFuture = new Future();
        var options = {
            "facet": true,
            "facet.field": ["publisher", "journalId", "all_topics", "facet_all_authors_cn", "facet_all_authors_en", "year", "pacsCodes", "contentType"],
            "hl": true,
            "hl.fl": "title.en,title.cn,all_authors_cn,all_authors_en,all_topics,year,all_topics,doi,abstract,accessKey",
            "hl.preserveMulti": true,
            "hl.simple.pre": "<span class='highlight'>",
            "hl.simple.post": "</span>",
            "hl.fragsize":0,
            "wt": "json"
        };
        var userParams = _.clone(params) || {q: "*"};

        if (!userParams.q) {
            userParams.q = "*";
        } else {
            userParams.q = SolrUtils.getQueryStr(userParams.q)
        }
        if (userParams.sq) {
            _.each(userParams.sq, function (sq) {
                if(sq)userParams.q += " AND " + sq.toLowerCase();
            });
        }
        if (userParams.fq) {
            userParams.fq = SolrUtils.getFilterQueryStrArr(userParams.fq)
        }
        if (userParams.st) {
            var setting = _.clone(userParams.st);
            delete userParams.st;
            userParams = Science.JSON.MergeObject(userParams, setting);
        }
        userParams = Science.JSON.MergeObject(userParams, options);
        SolrClient.query(userParams, function (err, response) {
            if (!err) {
                var result = JSON.parse(response.content);
                SolrClient.triggerAfterSearch(result);
                return myFuture.return(result);
            }
            else {
                logger.warn("solr server encountered an error at: " + SolrClient.options.host + ":" + SolrClient.options.port, " attempting to process the following query: "+userParams.q);
                myFuture.throw(err);
                //logger.error(SolrClient.options);
            }
        });
        return myFuture.wait();
    }
};