myCollection = new Meteor.Collection('numbers')

if(Meteor.isClient){
  myPagination = new Paginator( myCollection);

  Template.test.helpers({
    numbers : function(){
      return myPagination.find({}, {itemsPerPage:15});
    },
    showResetButton : function(){
      return myPagination.find().currentPage() > 0;
    } 
  });
  Template.test.events({
    'click .reset' : function(){
       myPagination.reset();
    }
  })
    

}

  
if(Meteor.isServer){
  if (!myCollection.find().count()){
    var i=0;
    while (i<100){
      i++;
      myCollection.insert({number: i});
    }
  }    
  
}

  