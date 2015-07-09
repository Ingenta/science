Router.route('/api', function () {
    var req = this.request;
    var res = this.response;
    res.write("query:\n");
    //req.query["aa"]
    _.each(req.query,function(item){
        res.write(item+"\n");
    });
    res.write("form:\n");
    _.each(req.body,function(item){
        res.write(item+"\n");
    });
    res.end();
}, {where: 'server'});