// var data = [
//     {
//         label: '<a href="test">Acoustics</a>', id: 1,
//         children: [
//             { label: '<a href="test">Acoustic instrumentation</a>', id: 2 },
//             { label: '<a href="test"> Acoustic modeling</a>', id: 3 }
//         ]
//     },
//     {
//         label: '<a href="test">Astronomy and astrophysics</a>', id: 4,
//         children: [
//             { label: '<a href="test">Astrophysics</a>', id: 5 }
//         ]
//     }
// ];
// Template.Topics.rendered = function () {
// $('#topicTree').tree({
//     data: data,
//     autoOpen: false,
//     autoEscape: false
// });
// };

Template.TopicList.helpers({
    topics: function () {
        return  Topics.find({"parentName" : null});
    }
});
Template.SingleTopic.helpers({
    subTopics: function (parentName) {
        return  Topics.find({"parentName" : parentName});
    }
});
Template.addSubtopic.helpers({
    exampleDoc: function () {
        return Topics.findOne();
    }
});
