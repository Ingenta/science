Meteor.startup(function () {
    // if (Publishers.find().count() === 0) {
    //   for (var i = 0; i <= 3; i++) {
    //     Publishers.insert({
    //       name: Fake.word(),
    //       description: Fake.paragraph(4)
    //     });
    //   };
    // }
    // if (Roles.find().count() === 0) {
    //   for (var i = 0; i <= 10; i++) {
    //     Roles.insert({
    //       name: Fake.word()
    //     });
    //   };
    // }
    if (Topics.find().count() === 0) {
        var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
            "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
        _.each(names, function (name) {
            Topics.insert({
                name: name
            });
        });
        for (var i = 0; i <= 3; i++) {
            _.each(names, function (name) {
                Topics.insert({
                    name: Fake.word(),
                    parentName: name
                });
            });
        }
    }
});
