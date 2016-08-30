Science.ThumbUtils={};

var maxThumbSize={width:600, height:900};

var thumbTasks = [];
var taskManager = {
    exists:function(filename){
        filename = filename.trim().toLowerCase();
        return !!_.find(thumbTasks,function(taskfile){
            return taskfile == filename;
        })
    },
    add:function(filename){
        filename = Science.String.getFileName(filename).trim().toLowerCase();
        if(!this.exists(filename))
            thumbTasks.push(filename);
    },
    remove:function(filename){
        thumbTasks.splice(filename,1);
    }
}

Science.ThumbUtils.TaskManager = taskManager;