Template.registerHelper('getImageHelper', function(pictureId){
        var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
        return (Images && pictureId && Images.findOne({_id: pictureId}).url()) || noPicture;
});

Template.registerHelper('isChinese', function(language){
        if(language==="zh-CN")
                return true;
            return false;
});


Template.registerHelper('translateThis', function(language,chinese,english){
        if(language==="zh-CN")
                return chinese;
            return english;
});
