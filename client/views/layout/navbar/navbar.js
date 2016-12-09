Template.LeftMenu.helpers({
  publishers: function () {
    return Publishers.find({},{sort:{chinesename:1}});
},
hasPublishers: function () {
    return Publishers.find().count();
}
});
