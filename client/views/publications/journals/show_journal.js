ReactiveTabs.createInterface({
  template: 'basicTabs'
});

// Template.OverviewTemplate.helpers({
//   getJournalUrl: function () {
//     return "/publishers/abc/journals/banana";
//   },
//   getImage: function (pictureId) {
//     var noPicture ="http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg"
//     if(pictureId===undefined)
//     return noPicture;
//     return Images.findOne({_id: pictureId}).url();
//   },
//   getPublisherNameById: function (id) {
//     return Publishers.findOne({_id:id}).name;
//   },
// });

Template.myTemplate.helpers({
  context: function () {
    var currentTitle = Router.current().params.title;
    return Publications.findOne({title: currentTitle});
  }
});

Template.myTemplate.helpers({
  tabs: function () {
    // Every tab object MUST have a name and a slug!
    return [
    { name: 'Overview', slug: 'overview' },
    { name: 'Browse', slug: 'browse' },
    { name: 'About', slug: 'about' },
 /*     { name: 'Things', slug: 'things', onRender: function(template) {
        // This callback runs every time this specific tab's content renders.
        // As with `onChange`, the `template` instance is unique per block helper.
        alert("[tabs] Things has been rendered!");
      }}*/
      ];
    },
    activeTab: function () {
    // Use this optional helper to reactively set the active tab.
    // All you have to do is return the slug of the tab.

    // You can set this using an Iron Router param if you want--
    // or a Session variable, or any reactive value from anywhere.

    // If you don't provide an active tab, the first one is selected by default.
    // See the `advanced use` section below to learn about dynamic tabs.
    return Session.get('activeTab'); // Returns "people", "places", or "things".
  }
});

