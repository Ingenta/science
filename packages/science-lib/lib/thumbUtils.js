Science.ThumbUtils={};

Science.ThumbUtils.size={width:600, height:900};

var thumbTasks = [];
var taskManager = {
    exists:function(filename){
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
    },
    remove:function(filename){
        thumbTasks.splice(filename,1);
    }
}

Science.ThumbUtils.TaskManager = taskManager;
