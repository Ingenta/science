Template.SolrSearchBar.events({
    'click .btn': function () {
        var sword = $('#searchInput').val();
        if (sword.trim()!==""){
            SolrQuery.search({query:sword,setting:{from:"bar"}});
        }
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var sword = $('#searchInput').val();
            if (sword.trim()!==""){
	            SolrQuery.search({query:sword,setting:{from:"bar"}});
            }
        }
    }
});

Template.SolrSearchResults.events({
    'change input.datesort': function (event) {
        var sortStr = $(event.target).val();
        var setting = SolrQuery.params('st');
        if (sortStr) setting.sort = sortStr;
        else delete setting.sort;
        SolrQuery.params('st', setting);
        Router.go(SolrQuery.makeUrl());
    }
});

Template.SolrSearchResults.helpers({
    'articles': function () {
        return SolrQuery.get("docs");
    },
    'statusOK':function(){
        return SolrQuery.get("ok");
    },
    'resultFound':function(){
        return !!SolrQuery.get("numFound")
    },
    'showWaitting':function(){
        return SolrQuery.get("showWaitting");
    },
    'filters': function () {
        var facets = SolrQuery.get("facets");
        if(facets){
            var fields = Object.keys(facets);
            var results = [];
            for(var i=0;i<fields.length;i++){
                var filter = {filterOptions:[]};
                if(fields[i]=='all_topics'){
                    filter.name="topic";
                    filter.filterTitle=TAPi18n.__("FILTER BY Topic");
                    var facetTopic = facets[fields[i]];
                    for(var j=0;j<facetTopic.length;j+=2){
                        if(facetTopic[j+1]>0){
                            var topic= Topics.findOne({_id:facetTopic[j]});
                            if(topic){
                                filter.filterOptions.push({
                                    name:topic.englishName,
                                    cname:topic.name,
                                    count:facetTopic[j+1],
                                    field:"topic",
                                    val:facetTopic[j].replace(/ /g,'\\ ')
                                })
                            }
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='publisher'){
                    filter.name="publisher";
                    filter.filterTitle=TAPi18n.__("FILTER BY Publisher");
                    var facetPublisher = facets[fields[i]];
                    for(var j=0;j<facetPublisher.length;j+=2){
                        if(facetPublisher[j+1]>0){
                            var publisher= Publishers.findOne({_id:facetPublisher[j]});
                            filter.filterOptions.push({
                                name:publisher.name,
                                cname:publisher.chinesename,
                                count:facetPublisher[j+1],
                                field:fields[i],
                                val:facetPublisher[j]
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='facet_all_authors_cn' && TAPi18n.getLanguage()==='zh-CN'){
                    filter.name="author";
                    filter.filterTitle=TAPi18n.__("FILTER BY Author");
                    var facetAuthor = facets[fields[i]];
                    for(var j=0;j<facetAuthor.length;j+=2){
                        if(facetAuthor[j+1]>0){
                            filter.filterOptions.push({
                                name:facetAuthor[j],
                                cname:facetAuthor[j],
                                count:facetAuthor[j+1],
                                field:"author",
                                val:facetAuthor[j].replace(/ /g,'\\ ')
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='facet_all_authors_en' && TAPi18n.getLanguage()==='en'){
                    filter.name="author";
                    filter.filterTitle=TAPi18n.__("FILTER BY Author");
                    var facetAuthor = facets[fields[i]];
                    for(var j=0;j<facetAuthor.length;j+=2){
                        if(facetAuthor[j+1]>0){
                            filter.filterOptions.push({
                                name:facetAuthor[j],
                                cname:facetAuthor[j],
                                count:facetAuthor[j+1],
                                field:"author",
                                val:facetAuthor[j].replace(/ /g,'\\ ')
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='journalId'){
                    filter.name="journal";
                    filter.filterTitle=TAPi18n.__("FILTER BY Publications");
                    var facetJournal = facets[fields[i]];
                    for(var j=0;j<facetJournal.length;j+=2){
                        if(facetJournal[j+1]>0){
                            var journal= Publications.findOne({_id:facetJournal[j]});
                            journal && filter.filterOptions.push({
                                name:journal.title,
                                cname:journal.titleCn,
                                count:facetJournal[j+1],
                                field:fields[i],
                                val:facetJournal[j]
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='year'){
                    filter.name="pubyear";
                    filter.filterTitle=TAPi18n.__("FILTER BY Release Date");
                    var facetYear = facets[fields[i]];
                    for(var j=0;j<facetYear.length;j+=2){
                        if(facetYear[j+1]>0){
                            filter.filterOptions.push({
                                name:facetYear[j],
                                cname:facetYear[j],
                                count:facetYear[j+1],
                                field:fields[i],
                                val:facetYear[j]
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='pacsCodes'){
                    filter.name="pacs";
                    filter.filterTitle=TAPi18n.__("FILTER BY PACS");
                    var facetpacs = facets[fields[i]];
                    for(var j=0;j<facetpacs.length;j+=2){
                        if(facetpacs[j+1]>0){
                            filter.filterOptions.push({
                                name:facetpacs[j],
                                cname:facetpacs[j],
                                count:facetpacs[j+1],
                                field:"pacsCodes",
                                val:facetpacs[j]
                            })
                        }
                    }
                    results.push(filter);
                }else if(fields[i]=='contentType'){
                    filter.name="contentType";
                    filter.filterTitle=TAPi18n.__("FILTER BY Content Properties");
                    var facetType = facets[fields[i]];
                    for(var j=0;j<facetType.length;j+=2){
                        if(facetType[j+1]>0){
                            var articleType = ContentType.findOne({subject:facetType[j]});
                            if(articleType)
                                filter.filterOptions.push({
                                    name:TAPi18n.getLanguage()=='zh-CN'?articleType.name.cn:articleType.name.en,
                                    cname:TAPi18n.getLanguage()=='en'?articleType.name.en:articleType.name.cn,
                                    count:facetType[j+1],
                                    field:"contentType",
                                    val:facetType[j]
                                })
                        }
                    }
                    results.push(filter);
                }
            }
            return results;
        }else{
            console.log('no facet');
        }
    },
    'highlightFields': function(){
        return SolrQuery.get("highlight")[this._id];
    },
    'isFromTopic':function(){
        return SolrQuery.params("st") && SolrQuery.params("st").from === 'topic';
    },
    'pagingFunc':function(){
        return function(page,row){
            var setting = SolrQuery.params("st") || {};
            setting.start = (page-1) * row;
            setting.rows = row;
            SolrQuery.params("st",setting);
            //var url = SolrQuery.makeUrl();
            Router.go(SolrQuery.makeUrl());
        }
    },
    'currPage':function(){
        var setting = SolrQuery.params("st");
        if(setting && setting.start && setting.rows){
            return Math.ceil(setting.start/setting.rows)+1;
        }
        return 1;
    },
    'total':function(){
        var found = SolrQuery.session.get("numFound") || 0;
        return found;
    },
    'rows':function(){
        var setting = SolrQuery.params("st");
        if(setting && setting.rows){
            return setting.rows;
        }
        return 10;
    }
});




