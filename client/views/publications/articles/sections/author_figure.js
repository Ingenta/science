Template.authorFiguresSta.helpers({
    getAuthorFigById: function (id) {
        if (!id)return;
        var fig = FiguresStore.findOne({_id: id});
        if (!fig)return;
        return CDN.get_cdn_url() + fig.url({auth:false});
    }
});