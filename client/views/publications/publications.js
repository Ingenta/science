Template.FilterList.helpers({
		publishers: function () {
		  return Publishers.find();
		},
		publications: function () {
		  return Publications.find();
		},
		filteredPublications: function () {
			var pubId = Session.get('filterPublisher');
			if(pubId===undefined){
				return Publications.find();
			}
		  return Publications.find({publisher:pubId});
		},
		count: function (url) {
		  return Publications.find({publisher:url}).count();
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
		var publisherId = $(event.currentTarget).parent().find('.filterId').html();
                        Session.set('filterPublisher', publisherId);
    }
  });
