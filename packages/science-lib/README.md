添加水印与广告页工具使用方法
=============

Science.Pdf([
    "-i","/Users/jiangkai/1.4788933.pdf",   //待处理的pdf文件位置
    "-o","/Users/jiangkai/out.pdf",         //处理完成后保存的文件位置
    "-s","/Users/jiangkai/stamp.pdf",       //广告页位置
    "-w","testtest",                        //水印内容（红色、倾斜、大号字、中间）
    "-f","1111111122222222233333333"        //页脚内容（多行内容以回车符\n分割，最好不要超过4行）
    ],function(error,stdout,stderr){
        //回调函数
    }      
);

