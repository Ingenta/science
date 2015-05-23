Session.setDefault('thisPublisher', 0);
Template.PublicationList.helpers({
    publications: function () {
      return Publications.find();
  }
});
Template.PublisherWebsite.helpers({
    thisPublisher: function () {
        return Session.get('thisPublisher');
    }
});
Template.PublisherWebsite.rendered = function() {
    // var thisPublisherUrl = Router.current().params.urlname;
    // var thisPub = this.Publishers.findOne({urlname: thisPublisherUrl});
    // console.log(thisPub.name);
    // Session.set("thisPublisher", this.Publishers.findOne().name);
};
