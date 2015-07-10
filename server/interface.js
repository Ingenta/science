Router.route('/api', function () {
    var req = this.request;
    var res = this.response;
    res.write("query:\n");
    //req.query["aa"]
    _.each(req.query,function(item){
        res.write(item+"\n");
    });
    res.write("form:\n");
    var keyArray = Object.keys(req.body);
    _.each(keyArray,function(item){
        if(!req.body[item]){
            return res.end('Failed\n');
        }
        res.write(item+ ":"+ req.body[item] +"\n");
    });
    res.end('Success\n');
}, {where: 'server'});