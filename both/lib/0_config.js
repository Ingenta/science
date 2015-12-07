Meteor.isDevelopment = (Meteor.isServer ? process.env.ROOT_URL : window.location.origin).indexOf('localhost') != -1;

Config = {
    isDevMode: Meteor.isDevelopment,
    tempFiles: {
        uploadXmlDir: {
            tmpDir: '/tmp/uploads/tmp',
            uploadDir: '/tmp/uploads'
        },
        uploadExcelDir: '/tmp/excel'
    },
    staticFiles: {
        uploadFiguresDir: Meteor.isDevelopment ? '/tmp/figures' : '/bundle/cfs/files/figures',
        uploadPdfDir: Meteor.isDevelopment ? '/tmp/pdfs' : '/bundle/cfs/files/pdfs'
    },

    ftp: {
        downloadDir: "/tmp/downloads",
        connectOptions: {
            host: "127.0.0.1",
            user: "liu",
            password: "123456",
            port: 21,
            connTimeout: 10000,
            pasvTimeout: 10000
        },
        moveToDir: "/newFile"
    },
    Routes: {
        ADPages: {
            journal: [
                'journal.name.toc',
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
                'journal.name.toc',
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
        displayJournalLogin: {
            journal: [
                'journal.name.toc',
                'article.show',
                'journal.name'
            ]
        }
    },
    Media: {
        allowType: ['mp3', 'mp4', 'ppt', 'pptx'],
        maxSize: 200 //MB
    },
    fieldsFromXmlToUpdate: [
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
    parser: {
        contentTypeDic: {
            article: ["article", "论文", "research paper"],
            editorial: ["editorial", "评述"],
            forum: ["论坛", "Forum"]
        }
    },
    otherPlatformLoginUrl: {
        scholarone: "https://mc03.manuscriptcentral.com/",
        editors: "http://ees.scichina.com/user/login.action?pageCode="
    },
    otherPlatformRegisterUrl: {
        editors: "http://ees.scichina.com/user/registuser_scichina.action"
    },
    miniplatformPublisherName:"China Science Publishing"
};
if (Meteor.isServer) {
    Config.defaultAdmin = {
        "username": "admin",
        "password": "123123",
        "level":"admin",
        "email": "admin@scp.com"
    }
    Config.AutoTasks = {
        start: process.env.RUN_TASKS,
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
        },
        FTPSCAN: {
            rate: "every 30 minutes"
        }
    }
}

