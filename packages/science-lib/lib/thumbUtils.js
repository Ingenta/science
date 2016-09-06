Science.ThumbUtils={};

Science.ThumbUtils.size={width:600, height:900};


var thumbTasks = [];
var thumbCollections = ["figures"];
var taskManager = {
    exists:function(storeName, filename){
        if(!_.find(thumbCollections,function(cname){
            return cname == storeName;
        })) return;
        
        filename = filename.trim().toLowerCase();
        var num = _.sortedIndex(thumbTasks, {fileName: '', createOn: new Date().getTime() - 5*60*1000}, 'createOn');
        thumbTasks.splice(0,num);
        return !!_.find(thumbTasks,function(taskfile){
            if(taskfile)
            return taskfile.fileName == filename;
        })
    },
    add:function(filename){
        filename = Science.String.getFileName(filename).trim().toLowerCase();
        if(!this.exists(filename))
            thumbTasks.push({fileName:filename,createOn:new Date().getTime()});
    }
}

Science.ThumbUtils.TaskManager = taskManager;
