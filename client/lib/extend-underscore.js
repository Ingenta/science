if(_ && !_.findIndex){
    _.findIndex=function(arr,func){
        var result=-1;
        var index = 0;
        _.find(arr,function(item){
            if(func(item))
                result=index;
            index++;
        })
        return result;
    }
}