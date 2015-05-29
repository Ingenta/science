Template.FilterList.helpers({
	publishers: function () {	
		var pubId = Session.get('filterPublisher');
		if(pubId===undefined){
			return Publishers.find();
		}
	  return Publishers.find({_id:pubId});
	},
	publications: function () {
		var pubId = Session.get('filterPublisher');
		if(pubId===undefined){
			return Publications.find();
		}
	  return Publications.find({publisher:pubId});
	},
	count: function (id) {
	  return Publications.find({publisher:id}).count();
	},
	getImage: function (pictureId) {
	  var noPicture ="http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg"
	  if(pictureId===undefined)
	  return noPicture;
	  return Images.findOne({_id: pictureId}).url();
	}

});
  Template.FilterList.events({
    'click .filterButton': function (event) {
		var f = $(event.currentTarget).find('.filterId').html();
      Session.set('filterPublisher', f);
    }
  });
Template.FilterList.onRendered(function () {
	Session.set('filterPublisher', undefined);
});