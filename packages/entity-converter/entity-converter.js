JEC = {};

var matchEntityReg = /&\w{1,10};/g;

JEC.name2Char=function(str){
    var results=[];
    var match;
    while(match=matchEntityReg.exec(str)){
        if(results.indexOf(match[0])<0){
            results.push(match[0]);
        }
    }
    if(results.length>0){
        for(var i=0;i<results.length;i++){
            var obj= _.find(JEC.map,function(item){
                return item.name == results[i];
            })
            if(obj){
                str=str.replace(new RegExp(results[i],'g'),obj.char);
            }
        }
    }
    return str;
}