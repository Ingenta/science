Meteor.isDevelopment = (Meteor.isServer ? process.env.ROOT_URL : window.location.origin).indexOf('localhost') != -1;
Config = {
    isDevMode: Meteor.isDevelopment,
    "defaultAdmin": {
        "username": "admin",
        "password": "123123",
        "email": "admin@scp.com"
    },
    uploadXmlDir: {
        tmpDir: '/tmp/uploads/tmp',
        uploadDir: '/tmp/uploads'
    },
    uploadMediaDir: {
        tmpDir: '/tmp/uploads/tmp',
        uploadDir: '/tmp/uploads'
    },
    uploadPdfDir: '/tmp/pdf',
    uploadExcelDir: '/tmp/excel',
    ftp: {
        downloadDir: "/tmp/downloads"
    },
    ADPages: {
        journal: [
            'journal.name.volume',
            'article.show',
            'journal.name'
        ],
        global: [
            'home',
            'topics',
            'authorCenter',
            'publishers',
            'publications',
            'collections'
        ]
    },
    NewsPage: {
        journal: [
            'journal.name.volume',
            'journal.name'
        ],
        global: [
            'home'
        ]
    },
    AccessKey: [
        'publisher.name',
        'publications',
        'journal.name',
        'article.show',
        'solrsearch'
    ],
    solrCore: {
        host: "192.168.99.100",
        port: "8983",
        core: "/articles",
        path: "/solr"
    },
    Media: {
        allowType: ['mp3', 'mp4', 'ppt', 'pptx'],
        maxSize: 200 //MB
    },
    AutoTasks: {
        start: true,
        DOI_Register: {
            savePath: "/tmp/doi-register-file/",//生成的注册文件保存位置，必须。
            recvEmail: "kai.jiang@digitalpublishing.cn",//接受注册结果反馈的邮箱地址，必须
            rootUrl: "http://phys.scichina.com:8083/sciG/CN/",//必须以/结束 ，必须
            rate: "at 1:00 am",//提交注册请求的频率，默认每晚1点
            condition: 1 //新的注册任务只处理多少天以前注册过，或从未注册过的的doi ,默认1天前
        },
        Citation: {
            rate: "at 1:00 am except on Sat" //提交注册请求的频率，默认每周六凌晨1点"
        },
        Send_Alert_Email: {
            rate: "at 3:00 am"
        }
    },
    fieldsWhichFromXml: [
        "title",
        "abstract",
        "journalId",
        "publisher",
        "elocationId",
        "year",
        "month",
        "issue",
        "volume",
        "issueId",
        "volumeId",
        "received",
        "accepted",
        "published",
        "topic",
        "contentType",
        "acknowledgements",
        "pdfId",
        "authors",
        "authorNotes",
        "affiliations",
        "sections",
        "figures",
        "tables",
        "keywords",
        "references",
        "pubStatus",
        "accessKey",
        "language",
        "pacs",
        "fundings"
    ],
    pdf: {
        watermark: "Accepted",
        footmark: "All article content, except where otherwise noted, is licensed under a Creative Commons Attribution 3.0 Unported license.\n"
        + "Downloaded to IP: {ip} On: {time} {url}"
    },
    rootUrl: Meteor.absoluteUrl(),
    mainPublish: "hSsscs85HXuu2qTfJ",
    searchKeywordFrequency: 3000,
    sysAdmin: "admin",
    parser:{
        contentTypeDic:{
            article:["article","论文","research paper"],
            editorial:["editorial","评述"],
            forum:["论坛","Forum"]
        }
    },
    otherPlatformLoginUrl:{
        scholarone:"https://mc03.manuscriptcentral.com/",
        editors:"http://ees.scichina.com/user/login.action?pageCode="
    },
    otherPlatformRegisterUrl:{
        editors:"http://ees.scichina.com/user/registuser_scichina.action"
    },
    displayJournalLogin: {
        journal: [
            'journal.name.volume',
            'article.show',
            'journal.name'
        ]
    }
};