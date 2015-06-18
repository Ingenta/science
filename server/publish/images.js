Meteor.publish('images', function() {
  return Images.find();
});
Meteor.publish('articleXml', function() {
  return ArticleXml.find();
});
