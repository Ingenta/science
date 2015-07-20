Template.collectionsList.helpers({
	collections:function(){
		var pubId = Session.get('filterPublisher');
		var first = Session.get('firstLetter');
		var numPerPage = Session.get('PerPage');
		if(numPerPage === undefined){
			numPerPage = 10;
		}
		var q = {};
		pubId && (q.publisherId = pubId);
		first && (q.title = {$regex: "^" + first, $options: "i"});
		return collPaginator.find(q,{itemsPerPage:numPerPage});
	}
});