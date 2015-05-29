Meteor.startup(function () {
    // if (Publishers.find().count() === 0) {
    //   for (var i = 0; i <= 3; i++) {
    //     Publishers.insert({
    //       name: Fake.word(),
    //       chinesename: Fake.word(),
    //       description: Fake.paragraph(4)
    //     });
    //   };
    // }


/*    if (Topics.find().count() === 0) {
        var names = [
        "Acoustics",
        "Astronomy and astrophysics",
        "Biological physics",
        "Condensed matter physics",
        "Energy",
        "General physics",
        "Geophysics",
        "Interdisciplinary physics",
        "Materials science",
        "Mathematical physics",
        "Nanotechnology",
        "Nuclear physics",
        "Optics and optical physics",
        "Particle physics",
        "Physical chemistry",
        "Plasma physics",
        "Quantum mechanics",
        "Rheology and fluid dynamics",
        "Society and organization",
        "Statistical physics"
        ];
        _.each(names, function (name) {
            Topics.insert({
                name: name
            });
        });
        for (var i = 0; i <= 5; i++) {
            _.each(names, function (name) {
                Topics.insert({
                    name: Fake.word(),
                    parentName: name
                });
            });
        }
    }*/

    // if (Topics.find().count() === 0) {
    //     var names = [
    //     "Acoustics",
    //     "Astronomy and astrophysics",
    //     "Biological physics",
    //     "Condensed matter physics",
    //     "Energy",
    //     "General physics",
    //     "Geophysics",
    //     "Interdisciplinary physics",
    //     "Materials science",
    //     "Mathematical physics",
    //     "Nanotechnology",
    //     "Nuclear physics",
    //     "Optics and optical physics",
    //     "Particle physics",
    //     "Physical chemistry",
    //     "Plasma physics",
    //     "Quantum mechanics",
    //     "Rheology and fluid dynamics",
    //     "Society and organization",
    //     "Statistical physics"
    //     ];
    //     _.each(names, function (name) {
    //         Topics.insert({
    //             name: name
    //         });
    //     });
    //     for (var i = 0; i <= 5; i++) {
    //         _.each(names, function (name) {
    //             Topics.insert({
    //                 name: Fake.word(),
    //                 parentName: name
    //             });
    //         });
    //     }
    // }

});
