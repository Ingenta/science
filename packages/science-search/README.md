Fields for query:
-----------------
    fieldMap : {
        "title":["title.cn","title.en"],
        "doi":["doi"],
        "issn":["issn","EISSN"],
        "cn":["CN"],
        "code":["doi","issn","EISSN","CN"],
        "journalTitle":["journal.title","journal.titleCn"],
        "keyword":["all_keywords"],
        "author":["all_authors_en","all_authors_cn"],
        "affiliation":["all_affiliations_en","all_affiliations_cn"],
        "abstract":["abstract"],
        "fulltext":["fulltext"]
    }
 
Fields for filter:
-----------------
    facetFieldMap:{
        "publisher":["publisher"],
        "journalId":["journalId"],
        "author":["facet_all_authors_en","facet_all_authors_cn"],
        "topic":["all_topics"],
        "year":["year"],
        "month":["month"],
        "volume":["volume"],
        "issue":["issue"],
        "publishDate":["publishDate"]
    }

Usage：
-----------------
    SolrQuery.search({query:[
        {key:"title",valu:"aaa"},
        {logicRelation:"NOT",key:"code",value:"123123"}
    ],filterQuery:[
        {key:"publisher",value:"ljdfogjojosdf"},
        {key:"topic",value:"34sfdgdsfsdfsdf"}
    ]});
