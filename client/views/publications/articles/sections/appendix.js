Template.appendixTemplate.helpers({
    showAppendix:function(){
        if(_.isString(this.appendix))
            return this.appendix;
        else if(_.isObject(this.appendix) && this.appendix.html)
            return this.appendix.html;
    }
})