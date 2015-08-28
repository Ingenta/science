Template.publicationPdfContent.helpers({
    authorResources: function () {
        var publicationId = Session.get('currentJournalId');
        return Publications.find({_id:publicationId});
    },
    pdfValue:function(){
        var file = Collections.Files.findOne({_id:this.fileId});
        return file.url()+"&download=true";
    }
})
