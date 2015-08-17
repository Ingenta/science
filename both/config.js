Config={
    isDevMode:true,  //开发模式
    "defaultAdmin":{
        "username":"admin",
        "password":"123123",
        "email":"admin@scp.com"
    },
    uploadXmlDir:{
        tmpDir: '/tmp/uploads/tmp',
        uploadDir:'/tmp/uploads'
    },
    ftp:{
        downloadDir:"/tmp/downloads"
    },
    ADPages: {
        journal: [
            'journal.name.volume',
            'article.show',
            'journal.name'
        ],
        global:[
            'home',
            'topics',
            'author',
            'publishers',
            'publications',
            'collections'
        ]
    },
    solrCore: {
        host:"192.168.99.100",
        port:"8983",
        core:"/articles",
        path:"/solr"
    }
}