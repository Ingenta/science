Template.authorFiguresSta.helpers({
    getAuthorFigById: function (id) {
        if (!id)return;
        var fig = FiguresStore.findOne({_id: id});
        if (!fig)return;
        return fig.url({auth:false});
    }
});