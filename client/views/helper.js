Template.toggleField.helpers({
    getContent: function(field){
        if (typeof field == "object"){
            if (TAPi18n.getLanguage() === "zh-CN") {
                if (!field.cn)return field.en;
                return field.cn;
            }
            if (!field.en)return field.cn;
            return field.en;
        }else{
            return field;
        }
    }
})