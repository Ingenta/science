Template.CitedByTemplate.helpers({
    getAuthorString: function () {
        var text = "";
        _.each(this.contributors, function (item) {
            text += (item.surname || "") + (item.givenName || "") + ",";
        });
        return text.substring(0, text.length-1);
    }
})
