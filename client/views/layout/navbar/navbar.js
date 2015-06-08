Template.LeftMenu.helpers({
  publishers: function () {
    return Publishers.find();
},
hasPublishers: function () {
    return Publishers.find().count();
}
});
