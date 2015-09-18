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
        "page":["startPage",'elocationId'],
        "publishDate":["published"]
    }

Usage：
-----------------
    SolrQuery.search({query:[
        {key:"title",val:"aaa"},
        {logicRelation:"NOT",key:"code",val:"123123"}
    ],filterQuery:[
        {key:"publisher",val:"ljdfogjojosdf"},
        {key:"topic",val:"34sfdgdsfsdfsdf"},
        {key:"publishDate",val:{start:'2015-1-2',end:new Date()}}
    ],setting:{
        sort:"publishDate desc",
        rows:10,  //每页10条数据
        start:11,  //从第几条开始查询
        fl:"title.cn, title.en" //只返回指定字段内容
    }});
###注意：
    日期值可以是string也可以是Date，start和end可以只有一个。