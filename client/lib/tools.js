/**
 * Created by 蒋凯 on 2015/5/29.
 */
(function (window) {
    var PTool = {
        /**根据图片ID获取图片*/
        getImage:function(pictureId) {
            var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
            return (Images && pictureId && Images.findOne({_id: pictureId}).url()) || noPicture;
        },
        isChinese: function(language){
            if(language==="zh-CN")
                return true;
            return false;
        }
    };
    window.PTool = PTool;
    Template.registerHelper('PT', PTool);
}(window))
