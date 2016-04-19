Template.CitedByTemplate.helpers({
    getAuthorString: function () {
        var text="";
        for(var i=0;i<this.contributors.length&&i<3;i++){
            text += this.contributors[i].surname + " " + this.contributors[i].givenName + ", "
        }
        text=text+"et al. "
        return text;
    },
    formatTitle:function(){
        return this.articleTitle && (this.articleTitle + ". ");
    },
    formatJournalTitle:function(){
        return this.journal.title && (this.journal.title + ", ");
    },
    formatYear:function(){
        return this.year && (this.year + ", ");
    },
    formatIssue:function(){
        return this.issue && ('('+this.issue+')' + " : ")
    },
    startPage: function (){
        return this.firstPage && (this.firstPage);
    },
    endPage: function (){
        return this.lastPage && ('-'+this.lastPage);
    },
})
