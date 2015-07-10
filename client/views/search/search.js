jQuery.fn.highlight = function(pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function() {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function() {
    return this.find("span.highlight").each(function() {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};


Template.SearchBar.events({
    'click .btn': function () {
        var query = $('#searchInput').val();
        if (query)
            Router.go('/s/' + query);
    },
    'keydown input': function (event) {
        if (event.keyCode === 13) {
            var query = $('#searchInput').val();
            if (query)
                Router.go('/s/' + query);
        }
    }
});

Template.SearchResults.helpers({
    'results': function () {
        var q = Router.current().params.searchQuery;
        $(".resultsList").removeHighlight(q);
        $(".resultsList").highlight(q);
        console.log(q);
        if (q) {
            var mongoDbArr = [];
            mongoDbArr.push({title: {$regex: q, $options: "i"}});
            return Articles.find({$or: mongoDbArr});
        }
        var t = Router.current().params.topicQuery;
        if (t) {
            return Articles.find({topic: t});
        }
        var a = Router.current().params.authorQuery;
        return Articles.find({"authors.given": a.split(" ")[1], "authors.surname": a.split(" ")[0]});
    },
    'filters': function () {

//        Meteor.call("getFilter",filtername,query,function(err,result){
//            if(!err){
//                Session.set(filtername,result);
//            }
//
//        });
//        return Session.get(filtername);
        return [{
            filterTitle: TAPi18n.__("FILTER BY Publisher"),
            filterOptions: [{
                name: '科学出版社',
                count: '121'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Publications"),
            filterOptions: [{
                name: '《科学出版社》',
                count: '21'
            }, {
                name: '《科学》',
                count: '15'
            }, {
                name: '《出版社》',
                count: '151'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Content Properties"),
            filterOptions: [{
                name: '论文',
                count: '121'
            }, {
                name: '评述',
                count: '113'
            }, {
                name: '快讯',
                count: '141'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Author"),
            filterOptions: [{
                name: '谢和平',
                count: '121'
            }, {
                name: '郑泽民',
                count: '113'
            }, {
                name: '张龙',
                count: '141'
            }]
        }, {
            filterTitle: TAPi18n.__("FILTER BY Release Data"),
            filterOptions: [{
                name: '2014年',
                count: '121'
            }, {
                name: '2013年',
                count: '113'
            }, {
                name: '2011年',
                count: '141'
            }, {
                name: '2010年',
                count: '141'
            }]
        }]
    }
});


