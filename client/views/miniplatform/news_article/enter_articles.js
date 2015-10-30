Template.enterpriseCultureDetails.helpers({
    cultureDetails: function () {
        var enterId = Router.current().params.cultureId;
        return NewsContact.find({_id: enterId});
    }
});